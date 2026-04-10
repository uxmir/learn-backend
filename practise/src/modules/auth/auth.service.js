import crypto from 'crypto'
import ApiError from '../../common/utils/api-error'
import User from '../auth/auth.model'
import { generateAccessToken, generateRefreshToken, generateResetToken, verifyRefreshToken } from '../../common/utils/jwt'
import { sendVerificationEmail } from '../../common/config/email'
const hashToken=crypto.createHash("sha256").update(token).digest("hex")

const register=async({email,password,name,role})=>{
if(!email || !password || !name || !role) throw ApiError.notFound("each feild is required")
const exist=await User.findOne({email})
if(exist) throw ApiError.conflict("this email is already exist")
const {rawToken,hashedToken}=generateResetToken()
const user=await User.create({
  name,
  email,
  password,
  role,
  verificationToken:hashedToken
})
try {
 const verifyEmail= await sendVerificationEmail(email,rawToken)
 return verifyEmail
} catch (error) {
  console.error(error)
}

const userObj=user.toObject()
delete userObj.password
delete userObj.verificationToken
}

const login=async({email,password})=>{
if(!email || !password) throw ApiError.notFound("each feild is required")
const user=await User.findOne({email}).select("+password")
if(!user) throw ApiError.unauthorized("user is not exists")
const ismatch=await user.comparePassword(password)
if(!ismatch) throw ApiError.conflict("password didn't match")
if(!user.isVerified) throw ApiError.unauthorized("email is not verified")
const accessToken=generateAccessToken({user:req.user._id,role:req.user.role})
const refreshToken=generateRefreshToken({user:req.user._id,role:req.user.role})
user.refreshToken=hashToken(refreshToken)
const userObj=user.toObject()
delete userObj.password
delete userObj.refreshToken
return{user:userObj,accessToken,refreshToken}
}
const logout=async(userId)=>{
  await User.findByIdAndUpdate({userId,refreshToken:null})
}

const refresh=async(token)=>{
 if(!token) throw ApiError.unauthorized("refresh token is missing") 
 const decoded=verifyRefreshToken(token)
 const user=await User.findById(decoded.id)
  if(!user) throw ApiError.unauthorized("user token is missing")
  if(user.refreshToken !==hashToken(token))  throw ApiError.unauthorized("token is invalid") 
  const accessToken=generateAccessToken({user:req.user._id,role:req.user.role})
  return accessToken
}
const verifyEmail=async({token})=>{
   if(!token) throw ApiError.unauthorized("refresh token is missing") 
  const user=await User.findOne({email}).select("+verificationToken")
   if(!user) throw ApiError.unauthorized("user token is missing")
  user.isVerified=true;
  user.verificationToken=undefined;
  await user.save()
  return user
}
const forgotPassword=async({email})=>{
  const user=await User.findOne({email})
   if(!user) throw ApiError.unauthorized("user token is missing")
   const {rawToken,hashedToken}=generateResetToken()
   user.resetPasswordToken=hashedToken;
   user.resetPasswordExpires=Date.now() + 15+ 60+1000
   await user.save()
}
export {register,login,logout,refresh,verifyEmail,forgotPassword}
