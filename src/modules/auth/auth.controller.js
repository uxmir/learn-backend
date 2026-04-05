import * as authService from "./auth.service";
import ApiResponse from "../../common/utils/api-response";
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
  const user = await authService.getMe(req.user.id);
  ApiResponse.ok(res, "User profile", user);
};
export { register, login, logout, getMe };
