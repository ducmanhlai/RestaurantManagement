import { Router } from "express";
import user_controller from "controller/user_controller";
import auth from '../middleware/authenJWT'
const user_router = Router();
user_router.get('/get', auth.authenUser,user_controller.getStaff);
// user_router.post('/staff/create', user_controller.createStaff);
// user_router.post('/staff/modify', user_controller.modifyStaff);
export default user_router