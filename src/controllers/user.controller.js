import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from '../utils/ApiResponse.js'
const generateAccessAndRefreshToken = async (userid) => {
    const user = await User.findById(userid)
    const accessToken =  user.generateAccessToken()
    const refreshToken =  user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
}
const registerUser = asyncHandler(async (req,res) =>{
     const { fullname,email,username,password } = req.body
    //  console.log("email",email)
    //  console.log("fullname",fullname)
    //  console.log("username",username)
    //  console.log("password",password)
    if([fullname,email,username,password].some((field)=> field?.trim() === ""))
    {
        throw new ApiError(400,"All fields are required")
    }

   const existedUser =  await User.findOne({
        $or : [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exists")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath;
    try
    { 
        coverImageLocalPath = req.files?.coverImage[0]?.path
    }
    catch(err) {
        coverImageLocalPath = null
    }
    // console.log(coverImageLocalPath)
    if(!avatarLocalPath){
        throw new ApiError(400,'Avatar file is required')
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar) throw new ApiError(400,'Avatar file is required')

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser) throw new ApiError(500,"Something went wrong")

    return res.status(201).json(new ApiResponse(200,createdUser,"Registed Successfully !!!"))
})

const loginUser = asyncHandler(async function(req,res){
    const {email,username,password} = req.body
    if(!username || !email) throw new ApiError(400,"username or password is required")
    const user = await User.findOne({
        $or : [{username} , {email}]
     })
     if(!user) throw new ApiError(400,"No user found")
      const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid) throw new ApiError(401,"Invalid password")
     const {accessToken,refreshToken}= await  generateAccessAndRefreshToken(user._id)
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
     const option = {
        httpOnly : true,
        secure : true
     }
     return res
     .status(200)
     .cookie("accessToken",accessToken)
     .cookie("refreshToken",refreshToken)
     .json( new ApiResponse(
        200,
        {user : loggedInUser , accessToken , refreshToken},
        "User logged in successfully"))
})


export  {registerUser,
loginUser}