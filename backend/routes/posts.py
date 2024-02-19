from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import JSONResponse
from models.posts import Post
from imagekitio import ImageKit
from decouple import config
from config.database import post_collection, user_collection
from bson import ObjectId
from datetime import datetime
from utils.error import handle_errors

imagekit = ImageKit(
    private_key=config("IMAGEKIT_PRIVATE_KEY"),
    public_key=config("IMAGEKIT_PUBLIC_KEY"),
    url_endpoint=config("IMAGEKIT_URL_ENDPOINT")
)

post = APIRouter()

@post.post("/", response_model=Post)
@handle_errors
async def create_post(post_form: Post = Form(...), image: UploadFile = File(...)):
    # Upload the image using ImageKit
    upload = imagekit.upload(
        file=image.file,
        file_name=image.filename,
        options={"tags": ["tag1", "tag2"]}
    )

    # Create the post
    post_data = {
        "user": post_form.user,
        "image": upload.response_metadata.raw,
        "content": post_form.content,
        "date": datetime.now()
    }
    new_post = await Post.create(**post_data)

    # Update user document to add the new post
    user_id = ObjectId(post_form.user.id)
    user_collection.update_one({"_id": user_id}, {"$push": {"posts": new_post.dict()}})

    # Insert the post into the post collection
    post_collection.insert_one(new_post.dict())

    return JSONResponse(status_code=201, content={"message": "Post created successfully"})
