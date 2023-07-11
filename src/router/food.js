import { Router } from "express";
import food_controller from "../controller/food_controller";
const food_router = Router();
food_router.get('/get', food_controller.get);
food_router.post('/create', food_controller.create);
food_router.put('/modify', food_controller.modify)
export default food_router