from pwdlib import PasswordHash

# object used to hash and verify password
password_hash = PasswordHash.recommended()

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