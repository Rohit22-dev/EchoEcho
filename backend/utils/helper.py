import random
import secrets
from datetime import datetime, timedelta

from fastapi import HTTPException, status, Depends
from decouple import config
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from fastapi_mail import FastMail, MessageSchema
from cachetools import TTLCache
from models.auth import TokenData

from config.database import user_collection
from config.email import mail_config
from models.auth import OTPData

# Initialize an in-memory cache with a time-to-live (TTL)
cache = TTLCache(maxsize=100, ttl=600)

JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt


def check_user(data):
    try:
        existing_user = user_collection.find_one({"email": data.email})
        if not existing_user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        existing_user['_id'] = str(existing_user['_id'])

        if not verify_password(data.password, existing_user['password']):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password")

        return existing_user
    except HTTPException as e:
        # If an HTTPException was raised intentionally, propagate it
        raise e
    except Exception as e:
        # If there's any other unexpected exception, raise a 400 Bad Request HTTPException
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


async def send_otp_email(email: str, user_id: str):
    # print("Sending OTP email...")

    # Generate otp
    otp = random.randint(11111, 99999)

    # Save otp data in cache
    cache[user_id] = {'otp': str(otp)}
    print(cache)
    body_html = f"<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f0f0f0;'><div style='max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px; background-color: #fff; text-align: center;'><p>This verification code was sent to your email for help getting back into a Shax Account:</p><p style='background-color: teal; color: #fff; padding: 8px; font-size: 18px; font-weight: bold; border-radius: 4px; display: inline-block;'>{otp}</p><p style='margin-top: 15px;'>Don’t know why you received this?<br>Someone who couldn’t remember their Shax Account details probably gave your email address by mistake. You can safely ignore this email.</p><p>To protect your account, don’t forward this email or give this code to anyone.</p><p style='margin-top: 20px; font-size: 12px; color: #888; text-align: center;'>Shax Accounts team</p></div></body>"

    message = MessageSchema(
        subject="Shax verification code",
        recipients=[email],
        body=body_html,
        subtype="html",
    )
    fm = FastMail(mail_config)
    await fm.send_message(message)
    return


def is_otp_valid(otp: str, user_id: str):
    try:
        otp_data = cache.get(user_id)
        if otp_data is None or otp_data.get('otp') is None:
            return False
        else:
            existing_otp = otp_data['otp']
            return existing_otp == otp
    except Exception as e:
        print(f"Error in is_otp_valid: {e}")
        raise e