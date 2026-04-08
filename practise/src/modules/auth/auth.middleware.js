import ApiError from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt";
import User from "./auth.model";
const authenticate = async (req, res, next) => {
  let token;
  if (req.hearders.startWith("Bearer")) {
    token = req.hearders.authorization.split(" ")[1];
  }

  if (!token) throw ApiError.unauthorized("Token is not found");
  const decoded = verifyAccessToken(token);
  const user = await User.findById(decoded.id);
  if (!user) throw ApiError.unauthorized("Token is not decoded");
  req.user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  next();
};

const authorize = ({ ...roles }) => {
  if (roles.includes(req.user.role))
    throw ApiError.unauthorized("Role is not found");
  return next();
};
export { authenticate, authorize };
