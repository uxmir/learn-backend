import crypto from "crypto";
import ApiError from "../../common/utils/api-error";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyRefreshToken,
} from "../../common/utils/jwt";
import User from "../../modules/auth/auth.model";
import { sendVerificationEmail } from "../../../../src/common/config/email";

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");
const register = async ({ email, name, password, role }) => {
  if (!email || !name || !password || !role)
    throw ApiError.notFound("something is missing ");
  const existing = await User.findOne({ email });
  if (!existing) throw ApiError.unauthorized("Invalid email");
  const { rawToken, hashedToken } = generateResetToken();
  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: hashedToken,
  });
  //sending email
  try {
    const email = await sendVerificationEmail(email, rawToken);
    return email;
  } catch (error) {
    console.error(error);
  }

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.verificationToken;
};

const login = async ({ email, password }) => {
  if (!email || !password) throw ApiError.notFound("something is missing ");
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw ApiError.unauthorized("Invalid email");
  const ismatch = await User.comparePassword(password);
  if (!ismatch) throw ApiError.conflict("invalid password");
  if (!user.isVerified) throw ApiError.forbidden("please verify email");
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
  user.refreshToken = hashToken(refreshToken);
  await user.save();
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;
  return { user: userObj, accessToken, refreshToken };
};

const logout = async (userId) => {
  await User.findByIdAndUpdate({ userId, refreshToken: null });
};

const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("unauthorized user");
  const decoded = await verifyRefreshToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("Invalid user ");
  if (user.refreshToken !== hashToken(token))
    throw ApiError.unauthorized("Invalid Token ");
  const accessToken = generateAccessToken({
    id: req.user._id,
    role: req.user.role,
  });
  return accessToken;
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw ApiError.unauthorized("email is not found");
  const { rawToken, hashedToken } = generateResetToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = Date.now() + 15 + 60 + 1000;
  await user.save();
};

const verifyEmail=async(token)=>{
  const hashedToken=hashToken(token)
  const user =await User.findOne({verificationToken:hashedToken}).select("+verificationToken")
    if (!user) throw ApiError.unauthorized("Invalid user ");
    user.isVerified=true;
    user.verificationToken=undefined;
    await user.save()
    return user
}
export { register, login, logout, refresh, forgotPassword, verifyEmail };
