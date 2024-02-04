import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import auth
from routes.posts import post


app = FastAPI()

# Define allowed origins, methods, and headers for CORS
origins = [
    "https://3000-monospace-echoecho-1706390169368.cluster-22qpi2wzsjc4utjzyqn2yu6ar6.cloudworkstations.dev", "https://3000-monospace-echoecho-1706390169368.cluster-22qpi2wzsjc4utjzyqn2yu6ar6.cloudworkstations.dev/login", "http://localhost:3000"
    # Add more origins as needed
]

# Add CORS middleware to your FastAPI application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(auth, prefix='/auth')
app.include_router(post, prefix='/post')

if __name__ == "__main__":
    uvicorn.run("main:app", host="localhost", port=8000, reload=True)
