import crypto from "crypto";
import ApiError from "../../common/utils/api-error";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
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
    const email = await sendVerificationEmail(email, token);
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
  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.accessToken;
  delete userObj.refreshToken;
  return { user: userObj, accessToken, refreshToken };
};

const logout=async(userId)=>{
    await User.findByIdAndUpdate({userId,refreshToken:null})
}
export { register,login,logout };
