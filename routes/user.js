

import { Router } from "express";
import { isUserAuthenticated, login, registerUser, userCheck } from "../controllers/user.js";
import { isValidMail } from "../middlewares/emailValidation/emailOtpSender.js";
import { isAuth } from "../middlewares/user.js";

const router= Router();

router.get('/',userCheck);
router.post('/register', registerUser);
router.post('/login',login);
router.get('/is-auth',isUserAuthenticated)

export default router;

