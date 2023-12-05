from datetime import timedelta

from fastapi import Depends, FastAPI, HTTPException, Security, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer

from . import database
from .security import create_access_token, get_current_user

app = FastAPI()

ACCESS_TOKEN_EXPIRE_MINUTES = 10_090
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


@app.on_event('startup')
async def startup():
    await database.connect()


@app.get("/")
async def read_home():
    data = await database.fetch_one("SELECT * FROM Users")
    return {"Nothing": "Here", 'a': data}


@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await database.fetch_one("SELECT * FROM Users WHERE username = :user_name AND password = :pass",
                                    values={"user_name": form_data.username, "pass": form_data.password})

    if not user:
        return {}

    role_code = await database.fetch_one("SELECT RoleCode FROM UserRoles WHERE UserID = :user_id",
                                         values={"user_id": user['userid']})

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username'], "scopes": role_code['rolecode']}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer", "username": user['username']}


# noinspection PyPep8Naming
def NoAuthTokenException():
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No auth token exists",
    )


@app.post("/new_round")
async def new_round(wpm: float, current_user=Security(get_current_user)):
    if not current_user:
        raise NoAuthTokenException()

    await database.execute("INSERT INTO Rounds (UserID, WPM) values (:user_id, :user_wpm)",
                           values={"user_id": current_user['userid'], "user_wpm": wpm})

    user_data = await database.fetch_one("SELECT AvgWPM FROM Users WHERE UserId = :user_id",
                                         values={"user_id": current_user['userid']})

    return {'avg_wpm': user_data['avgwpm']}
