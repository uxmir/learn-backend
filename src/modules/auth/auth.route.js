import { Router } from "express";
import * as controller from './auth.controller.js'
import validate from '../../common/middleware/validate.middleware'
import RegisterDto from "./dto/register.dto";
import { authenticate } from "./auth.midddleware.js";
import LoginDto from "./dto/login.dto.js";
const router=Router()

router.post("/register", validate(RegisterDto), controller.register)
router.post("/login",validate(LoginDto),controller.login)
router.post("/logout",authenticate,controller.logout)
router.get("/me",authenticate,controller.getMe)
export default Router