import ApiError from "../../common/utils/api-error";
import AuthService from "../auth/auth.service";
import ApiResponse from "../../common/utils/api-response";
const registerController = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    if (!user) throw ApiError.badRequest("user is not created");
    ApiResponse.created("user is created", user);
  } catch (error) {
    throw ApiError.catchError(`${error.message}`);
  }
};

const loginController=async(req,res)=>{
try {
   const {user,accessToken,refreshToken}=await AuthService.login(req.user.body) 
   res.cookie("refreshToken",refreshToken,{
    httpOnly:true,
    maxAge:7*24*60*60*1000
   })
    ApiResponse.ok("user has been logged",{user,accessToken})
} catch (error) {
throw ApiError.catchError(`${error.message}`);
}
}

const logoutControlller=async(req,res)=>{
    try {
        const user=await AuthService.logout(req.user.body)
        res.clearCookie("refreshToken")
        ApiResponse.ok("logout success")
    } catch (error) {
    throw ApiError.catchError(`${error.message}`);
    }
}
const refreshController=async(req,res)=>{
  try {
    const refreshToken=res.cookies.refreshToken
  const {accessToken}=await AuthService.refresh(refreshToken)
  ApiResponse.ok("accesstoken has been genreted",accessToken)
  } catch (error) {
    throw ApiError.catchError(`${error.message}`)
  }
}
export { registerController,loginController,logoutControlller,refreshController };
