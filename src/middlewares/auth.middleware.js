import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
export const verifyJWT = asyncHandler(async (req, res, next) => {
  //   accessing cookies
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    // In header method it looks for authorizaion header and Replace Bearer to empty to extract
    //the token
    //   if user is sending a header
    if (!token) {
      throw new ApiError(401, "Unauthorised request");
    }

    //validating token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    //Here it looks for user with same id as in decoded token in database as the token was made by jwt as a mongoose methoded which contained _id,email,username and fullName
    //while JWT token was being encoded so after being decoded ._id  is being used to check if the entry is valid that the user exists in database
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    //if user is found and is valid it is attached to req object
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
