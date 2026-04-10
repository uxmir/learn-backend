import crypto from 'crypto'
import ApiError from '../../common/utils/api-error'
import User from '../auth/auth.model'
import { generateResetToken } from '../../common/utils/jwt'
import { sendVerificationEmail } from '../../common/config/email'
const hash=crypto.createHash("sha256").update(token).digest("hex")

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
if(user.verificationToken !==hashedToken)  throw ApiError.unauthorized("token is invalid")

}
export {register}
