import multer, { MulterError } from "multer";
import ApiError from "../../../../classcode/src/common/utils/api-error";

const errorHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Something wrong in file",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof ApiError) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "internal server error",
  });
};

export default errorHandler;
