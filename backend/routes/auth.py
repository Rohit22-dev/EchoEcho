from fastapi import APIRouter, HTTPException, Response, Depends
from models.auth import User, LoginSchema
from config.database import user_collection
from utils.helper import check_user, get_password_hash, create_access_token, send_otp_email, is_otp_valid, get_current_user
from datetime import timedelta
from utils.error import handle_errors
from bson import ObjectId


auth = APIRouter()
ACCESS_TOKEN_EXPIRE_MINUTES = 30


@handle_errors
@auth.post("/login")
async def login(user: LoginSchema):
    existing_user = check_user(user)
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token_data = dict(existing_user)
    token_data.pop("password", None)
    access_token = create_access_token(
        data=token_data, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@handle_errors
@auth.post("/signup")
async def signup(user: User):
    existing_user = user_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    user.password = get_password_hash(user.password)
    # If the user doesn't exist, create a new one
    user_collection.insert_one(dict(user))
    return {"message": "User created successfully"}


@handle_errors
@auth.post("/forgot-password")
async def forgot_password(data: dict):
    email = data['email']
    existing_user = user_collection.find_one({"email": email})
    if not existing_user:
        raise HTTPException(status_code=400, detail="User does not exist")

    user_id = str(existing_user['_id'])
    await send_otp_email(email, user_id)
    return {"message": "Otp sent successfully", "user_id": user_id}


@handle_errors
@auth.post("/verify-otp/{user_id}")
async def verify_otp(data: dict, user_id: str):
    otp = data['otp']
    if is_otp_valid(otp, user_id):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        existing_user = user_collection.find_one({"_id": ObjectId(user_id)})
        existing_user['_id'] = str(existing_user['_id'])
        token_data = dict(existing_user)
        token_data.pop("password", None)
        access_token = create_access_token(
            data=token_data, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer"}
    else:
        raise HTTPException(
            status_code=400, detail="Invalid OTP / OTP expired")


@handle_errors
@auth.patch("/reset-password")
async def reset_password(data: dict, user:User=Depends(get_current_user)):
    password = data['password']
    username = user.username
    print("username", username)
    user_collection.find_one_and_update(
        {"username": username}, {"$set": {"password": get_password_hash(password)}})
    return {"message": "Password updated successfully"}
 