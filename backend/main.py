import uvicorn
from fastapi import FastAPI
from routes.auth import auth


app = FastAPI()

app.include_router(auth,prefix='/auth')


if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)