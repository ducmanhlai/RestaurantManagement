import { Router } from "express";
import status_order_controller from "controller/order_status_controller";
const status_order_router= Router();
status_order_router.get('/get',status_order_controller.get);
export default status_order_router;