import { Router } from "express";
import report_controller from "controller/report_controller";
const report_router = Router();
report_router.get('/get-by-time',report_controller.getReportByTime)
export default report_router