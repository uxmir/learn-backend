import crypto from "crypto";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt.utils.js";
import User from "./auth.model.js";

//creating hashToken
const hashToken = (token) => crypto.hash("sha256").update(token).digest("hex");
const register = async ({ name, email, password, role }) => {
  const existing = await User.findOne({ email });
  if (existing) throw ApiError.conflict("Email already exists");

  const { rawToken, hashedToken } = generateResetToken();
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });
  //seniding email to user with token
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.isVerified;
  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email or password");
  if (!user.isVerified) throw ApiError.forbidden("Please verify your email before login");
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id });
  user.refreshToken = hashToken(refreshToken);
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

const refresh=async (token)=>{
  if(!token) throw ApiError.unauthorized("Refreshtoken is missing")
 const decoded= verifyRefreshToken(token)
 const user= await User.findById(decoded.id).select("+refreshToken")
 if(!user) throw ApiError.unauthorized("User is not found")
 if(user.refreshToken !==hashToken) throw ApiError.unauthorized("Invalid refresh token")
 const accessToken= generateAccessToken({id:user._id,role:user.role}) 

 return {accessToken}
}

const logout=async(userId)=>{
  // const user=await User.findById(userId)
  // if(!user) throw ApiError.unauthorized("USer not found")
  // user.refreshToken=undefined;
  // await user.save({validateBeforeSave:false})

  await User.findByIdAndUpdate(userId,{refreshToken:null})
}

const forgotPassword=async(email)=>{
 const user= await User.findOne({email})
 if(!user) throw ApiError.notFound("No account with this email")
 const {rawToken,hashedToken}=generateResetToken()
 user.resetPasswordToken=hashedToken;
 user.resetPasswordExpires=Date.now()+15*60*1000
 await user.save()
}
export { register, login, logout,refresh,forgotPassword };
