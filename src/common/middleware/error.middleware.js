import multer from "multer";
import ApiError from "../../../classcode/src/common/utils/api-error";

const errorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "file must be less than 5mb",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
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
