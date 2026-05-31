import crypto from "crypto";
import User from "./auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
  verifyAccessToken,
} from "../../common/utils/jwt.utils.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import fs from "node:fs";
import imagekit from "../../common/config/imagekit.js";

// Hash refresh token before storing — same approach as reset tokens
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const register = async ({ name, email, password }) => {
  try {
    if (!name || !email || !password)
      throw ApiError.badRequest("each feild is required");
    const exist = await User.findOne({ email });
    if (exist) throw ApiError.conflict("this is here");
    const { rawToken, hashedToken } = generateResetToken();
    const user = await User.create({
      name,
      email,
      password,
      verificationToken: hashedToken,
    });
    try {
      await sendVerificationEmail(email, rawToken);
    } catch (error) {
      console.error(error);
    }
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.verificationToken;
    return {
      user: userObj,
    };
  } catch (error) {
    console.error(error);
  }
};

const login = async ({ email, password }) => {
  try {
    if (!email || !password)
      throw ApiError.unauthorized("each feild is required");
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw ApiError.notFound("email is not existed");
    const ismatch = await User.comparePassword(password);
    if (!ismatch) throw ApiError.conflict("password is not same");
    const accessToken = generateAccessToken({
      id:user?._id,
      role:user?.role,
    });
    const refreshToken = generateRefreshToken({
      id:user?._id,
      role:user?.role,
    });
    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
    return {
      user: userObj,
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error(error);
  }
};

const refersh=async(token)=>{
  try {
    if(!token) throw ApiError.unauthorized("vvvvvvvv")
    const hashedToken=hashToken(token)
    const user=await User.findOne({verificationToken:hashedToken}).select("+verificationToken")
    if(!user) throw ApiError.unauthorized("vvvvvvvv")
    if(user.refreshToken !==hashToken(token)) throw ApiError.unauthorized("vvvvvvvv")
    const accessToken=generateAccessToken({id:user?._id,role:user?.role})
  } catch (error) {
     
  }
}
// const verifyEmail=async(token)=>{
//   const trimmed=String(token).trim()
//   if(!trimmed) throw ApiError.unauthorized("vvvvvvvv")
//   const user=await User.findByIdAndUpdate(trimmed,
//    {
//     {id:user?._id},
//     {
//       $set:
//     }
//    } 
//     )
// }
const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw ApiError.unauthorized("email is not found");
    const { rawToken, hashedToken } = generateResetToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();
    try {
      await sendResetPasswordEmail(email, rawToken);
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
};
const resetPassword = async (token, newPassword) => {
  try {
    const hashedToken = hashToken(token);
    if (!token) throw ApiError.unauthorized("token is not here");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken + resetPasswordExpires");
    if (!user) throw ApiError.unauthorized("tjokenbcbdc");
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save()
  } catch (error) {
    console.error(error);
  }
};
export {};
