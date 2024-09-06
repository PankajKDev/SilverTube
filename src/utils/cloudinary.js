import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfull
    // console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

const oldAssetDeleter = async (asset) => {
  try {
 
    if (asset) {
      try{
        console.log(asset)
        const publicId=extractPublicId(asset)
    const res_type=asset.includes('/video/') ? 'video' : 'image';
        console.log(publicId)
        const result = await cloudinary.uploader.destroy(publicId,{resource_type:res_type});
        console.log("Image deletion result:", result);
      }
      catch(error){
console.log("Error deleting file :",error)
      }
    } 

  } catch (error) {
    console.error("Error deleting image:", error);
  }
};


export { uploadOnCloudinary,oldAssetDeleter };
