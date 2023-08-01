import { Router } from "express";
import statiѕticѕ_controller from "controller/statiѕticѕ_controller";
const statistics_router = Router();
statistics_router.get('/day', statiѕticѕ_controller.getTurnoverInDay);
statistics_router.get('/topSelling',statiѕticѕ_controller.getTopSellingProducts);
statistics_router.get('/turnover',statiѕticѕ_controller.getTurnover);
export default statistics_router