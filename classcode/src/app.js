import path from "path";
import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./modules/auth/auth.routes.js";
import ApiError from "./common/utils/api-error.js";
import errorHandler from "./common/middleware/error.middleware.js";
import multer from "multer";
import ApiResponse from "./common/utils/api-response.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.use("/api/auth", authRoute);

app.all("{*path}", (req, res) => {
  throw ApiError.notFound(`Route ${req.originalUrl} not found`);
});

app.use(errorHandler);

export default app;
