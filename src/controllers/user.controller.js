import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exists:username,email
  // check images,avatr
  //upload them to cloudinary avatar
  //create new user object-create entry in db
  // remove password and refresh token field from response
  //check for user creation
  //return response

  const { fullname, email, username, password } = req.body;
  console.log(email, password);
});

export { registerUser };
