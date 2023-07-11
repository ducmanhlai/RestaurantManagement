import { Router } from "express";
import type_controller from "controller/type_controller";
const type_router = Router();
type_router.get('/get', type_controller.getType);
type_router.post('/create', type_controller.createType);
type_router.post('/modify', type_controller.modifyType)
export default type_router