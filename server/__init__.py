from databases import Database
from fastapi.security import OAuth2PasswordBearer

database = Database("postgresql+asyncpg://type_test:test@localhost:5432")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
