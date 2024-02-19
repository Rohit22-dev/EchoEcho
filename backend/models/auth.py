from pydantic import BaseModel
from typing import Optional,List
from datetime import datetime


class User(BaseModel):
    _id: Optional[str] = None
    username: str 
    password: str
    email: str
    posts: List[str] = []
   



class LoginSchema(BaseModel):
    email: str
    password: str


class OTPData(BaseModel):
    otp: str
    timestamp: datetime


class Token(BaseModel):
    access_token: Optional[str] = None
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None

