import * as authService from "./auth.service";
import ApiResponse from "../../common/utils/api-response";
import ApiError from "../../common/utils/api-error";
const register = async (req, res) => {
  const user = await authService.register(req.body);
  ApiResponse.created(res, "user has been created", user);
};

const login = async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  ApiResponse.ok(res, "login successfull", { user, accessToken });
};

const logout = async (req, res) => {
  await authService.logout(req.user.body);
  res.clearCookie("refreshToken");
  ApiResponse.ok("Logout success");
};
const getMe = async (req, res) => {
  const user = await authService.getMe(req.user._id);
  ApiResponse.ok(res, "User profile", user);
};

const upload=async(req,res)=>{
  const file=req.file
  if(!file) ApiError.badRequest("invalid file ")
  const result=await authService.avatarUpload(req.user._id,file)
  ApiResponse.ok(res,"avatar uploaded",{avatarurl:result.url})
}
export { register, login, logout, getMe,upload   };
