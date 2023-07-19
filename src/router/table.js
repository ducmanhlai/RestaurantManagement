import { Router } from "express";
import table_controller from "controller/table_controller";
const table_router = Router();
table_router.get('/get', table_controller.get);
table_router.post('/create', table_controller.create);
table_router.post('/modify', table_controller.modify)
export default table_router