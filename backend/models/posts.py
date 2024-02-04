from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    id: int
    username: str

class Comment(BaseModel):
    user: User
    content: str

class Post(BaseModel):
    _id: str | None
    user: User
    image: {} 
    content: Optional[str] = None
    likes: List[User] = []
    comments: List[Comment] = []
    date: Optional[datetime] = None