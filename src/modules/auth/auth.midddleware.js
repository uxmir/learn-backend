import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt.utils";
import User from "./auth.model";

const authenticate = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) throw ApiError.unauthorized("Not Authenticated");
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("User no longer exists");
  req.user = {
    id: user._id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
  next();
};

const authorize = (...roles) => {
  if (!roles.includes(req.user.role)) {
    throw ApiError.forbidden("You do not permission to perform this action");
  }
  next();
};
export { authenticate,authorize };
