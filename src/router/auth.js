import { Router } from "express";
import auth_controller from "controller/auth_controller";
const auth_router = Router();
auth_router.post('/login',auth_controller.login);
export default auth_router