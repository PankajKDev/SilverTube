import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {oldAssetDeleter, uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if (
        [title,description].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "Title and Description are required");
      }
    const localVideoPath=req?.files?.videoFile[0].path;
    const thumbnailLocalPath=req?.files?.thumbnail[0].path;
    if(!localVideoPath){
throw new ApiError(400,"No video uploaded")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"no thumbnail provided") 
    }
const uploadedVideo=await uploadOnCloudinary(localVideoPath);
const uploadThumbnail=await uploadOnCloudinary(thumbnailLocalPath)
if(!uploadedVideo){
    throw new ApiError(500,"Error while uploading video")
}
const video=Video.create({
  videoFile:uploadedVideo?.url,
  thumbnail:uploadThumbnail?.url,
  title:title,
  description:description,
  duration:uploadedVideo?.duration,
  isPublished:true,
  owner:req?.user?._id
})
if(!video){
    throw new ApiError(500,"Error uploading video please try later")
}
return res.status(200).json(new ApiResponse(201,video,"Video uploaded"))
})

const getVideoById = asyncHandler(async (req, res) => {

    try{

        const { videoId } = req.params
     
        if(!videoId){
            throw new ApiError(400,"VideoID is required")
        }
        if(!isValidObjectId(videoId)){
            throw new ApiError(400,"Invalid Object ID")
        }
     const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(400,"Video fetch failed")
    }
    return res.status(200).json(new ApiResponse(200,video,"Fetch successfull"))

    }
   catch(error){
    throw new ApiError(400,error,"Video not found")
   }
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!videoId){
        throw new ApiError(400,"videoID is required to update video")
    }
    //TODO: update video details like title, description, thumbnail
    const {title,description}=req.body
    if (
        [title,description].some((field) => field?.trim() === "")
      ) {
        throw new ApiError(400, "Title and Description are required to update video");
      }
      const thumbnailLocalPath=req?.file?.path;
      console.log(req?.file?.path)
      if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required to update Video")
      }
      const uploadedThumbnail=await uploadOnCloudinary(thumbnailLocalPath)
if(!uploadedThumbnail){
    throw new ApiError(400,"Error while uploading thumbnail")
}  

const updatedVideo=await Video.findByIdAndUpdate(
    videoId,
    {
        $set:{title:title,
            description:description,
            thumbnail:uploadedThumbnail.url
        }
    },
    {
        new:true
    }
)

return res.status(200).json(new ApiResponse(200,"Video details updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
try{
    const { videoId } = req.params
    //TODO: delete video
    if(!videoId){
        throw new ApiError(400).json(400,"videoId is required")
    }
    if(!isValidObjectId){
        throw new ApiError(400,"Invalid videoId  while deleting video")
    }
    const deletedVideo= await Video.findByIdAndDelete(videoId)
    await oldAssetDeleter(deletedVideo?.videoFile)
    await oldAssetDeleter(deletedVideo?.thumbnail)

    if(!deletedVideo){
        throw new ApiError(400,"Error while deleting video")
    }
    return res.status(200).json(new ApiResponse(200,"Video successfully deleted"))
}
catch(error){
throw new ApiError(400,"The video doesn't exist :",error)
}

 
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"invalid videoId during check publish status")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError("cant find the video while changing publish status")
    }
    //changing publish status
    video.isPublished=!video.isPublished
await video.save();
return res.status(200).json(new ApiResponse(200,"Publish status changed successfully"))

})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
