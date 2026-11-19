
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app import models
from app.config import settings
from app.database import get_db


# Authentication settings shared by token creation and validation.
ACCESS_TOKEN_EXPIRE_MINUTES = 30
JWT_ALGORITHM = "HS256"

# Use the recommended password hashing configuration.
password_hash = PasswordHash.recommended()

# Read bearer tokens from the Authorization header.
bearer_scheme = HTTPBearer(auto_error=False)


def hash_password(password: str) -> str:
    """Hash a plaintext password before storing it in the database."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plaintext password against a stored password hash."""
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    """Create a signed JWT containing the user's ID and expiration time."""
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),  # Subject: the user identified by this token.
        "exp": expires_at,    # Expiration: when the token stops being valid.
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=JWT_ALGORITHM,
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> models.User:
    """Validate the bearer token and return the authenticated user."""
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if credentials is None:
        raise unauthorized

    try:
        # Verify the signature and expiration, and require both JWT claims.
        payload = jwt.decode(
            credentials.credentials,
            settings.jwt_secret_key,
            algorithms=[JWT_ALGORITHM],
            options={"require": ["sub", "exp"]},
        )

        user_id = int(payload["sub"])

    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError) as exc:
        raise unauthorized from exc

    # A valid token must belong to a user who still exists in the database.
    user = db.get(models.User, user_id)

    if user is None:
        raise unauthorized

    return user
