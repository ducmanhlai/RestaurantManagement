import { Router } from "express";
import order_controller from "../controller/order_controller";
const order_router = Router();
order_router.get('/pay', order_controller.payOrder);
order_router.get('/get-by-table',order_controller.getByTable)
order_router.get('/get',order_controller.getOrder)
// order_router.post('/create', order_controller.create);
// order_router.put('/modify', order_controller.modify)
export default order_router