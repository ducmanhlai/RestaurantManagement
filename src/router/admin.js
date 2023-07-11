import { Router } from "express";
import admin_controller from "controller/admin_controller";
const admin_router = Router();
admin_router.post('/staff/create', admin_controller.createStaff);
admin_router.get('/staff/get', admin_controller.getStaff);
admin_router.post('/staff/modify',admin_controller.modifyStaff);
export default admin_router