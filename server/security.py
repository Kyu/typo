from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status

from jose import jwt, JWTError

from . import database, oauth2_scheme

SECRET_KEY = "27608574e5452c36dae806cf479c0d19d3880d0b317bc5e66894106fc91ca4fc"
ALGORITHM = "HS256"


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Creates an access token based on some data
    TODO data should be just a user, and to_encode should include user id

    :param data: The data to encode in the token
    :param expires_delta: The amount of time for the token to expire

    :return: A jwt string
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


# noinspection PyPep8Naming
def CredentialsException(bearer: str):
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": bearer},
    )


async def get_current_user(token: str = Depends(oauth2_scheme)):
    authenticate_value = "Bearer"
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise CredentialsException(authenticate_value)
    except JWTError:
        raise CredentialsException(authenticate_value)

    user = await database.fetch_one("SELECT * FROM Users WHERE username = :user_name",
                                    values={"user_name": username})

    if not user:
        raise CredentialsException(authenticate_value)

    return user
