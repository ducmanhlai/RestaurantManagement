import { Router } from "express";
import statiѕticѕ_controller from "controller/statiѕticѕ_controller";
const statistics_router = Router();
statistics_router.get('/day', statiѕticѕ_controller.getgetRevenueInDay);
statistics_router.get('/topSelling',statiѕticѕ_controller.getTopSellingProducts);
statistics_router.get('/topProduct',statiѕticѕ_controller.getTopRenueveProducts);
statistics_router.get('/revenue',statiѕticѕ_controller.getRevenue);
export default statistics_router