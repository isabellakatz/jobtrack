from pwdlib import PasswordHash

from datetime import datetime, timedelta, timezone

import jwt

from app.config import settings

# object used to hash and verify password
password_hash = PasswordHash.recommended()

# Constand value for access token, valid 30 min
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# function used when a user register
def hash_password(password : str) -> str:
    return password_hash.hash(password)

# function used when a user is loggin in
# compares the given password with the hash in the db,
# verify() - true/false
def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password
    )

# Function to create an access token, valid for 30 min
def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm="HS256",
    )