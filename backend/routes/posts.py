from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from models.posts import Post
from imagekitio import ImageKit
from decouple import config
from config.database import post_collection,user_collection
from bson import ObjectId
from datetime import datetime
from utils.error import handle_errors


imagekit = ImageKit(
    private_key=config("IMAGEKIT_PRIVATE_KEY"),
    public_key=config("IMAGEKIT_PUBLIC_KEY"),
    url_endpoint = config("IMAGEKIT_URL_ENDPOINT")
)

post = APIRouter()

@handle_errors
@post.post("/", response_model=Post)
async def create_post(post_form: Post = Form(...)):
    
    upload = imagekit.upload(
        file=post_form.image.file,
        file_name=post_form.image.filename,
        options=UploadFileRequestOptions(
            tags = ["tag1", "tag2"]
        )
    )

    post = await Post.create(
        user=post_form.user,
        image=upload.response_metadata.raw,
        content=post_form.content,
        date=datetime.now()
    )

    existing_user = user_collection.find_one({"_id":ObjectId(post_form.user.id)})
    existing_user['posts'].append(post)
    user_collection.update_one({"_id":ObjectId(post_form.user.id)},{"$set":existing_user})

    post_collection.insert_one(jsonable_encoder(post))


    return JSONResponse(status_code=201, content={"message": "Post created successfully"})