import { Router } from "express";
import statiѕticѕ_controller from "controller/statiѕticѕ_controller";
const statistics_router = Router();
statistics_router.get('/get/day', statiѕticѕ_controller.getTurnoverInDay);
// statistics_router.post('/staff/modify',statistics_controller.modifyStaff);
export default statistics_router