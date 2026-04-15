import { Router } from "express";
import * as controller from './auth.controller.js'
import validate from '../../common/middleware/validate.middleware'
import RegisterDto from "./dto/register.dto";
import { authenticate } from "./auth.midddleware.js";
import LoginDto from "./dto/login.dto.js";
import { upload } from "../../common/middleware/multer.middleware.js";
const router=Router()

router.post("/register", validate(RegisterDto), controller.register)
router.post("/login",validate(LoginDto),controller.login)
router.post("/logout",authenticate,controller.logout)
router.get("/me",authenticate,controller.getMe)
router.post("/avatar",authenticate,upload.single("avatar"),controller.uploadAvatar)
export default Router