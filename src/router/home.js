import { Router } from "express";
import home_controller from "controller/home_controller";
const home_router= Router();
home_router.get('/home',home_controller.home);
home_router.get('/create-order',home_controller.createOrder);
home_router.get('/food',home_controller.food);
home_router.get('/staff',home_controller.staff);
home_router.get('/statistics',home_controller.statistics);
home_router.get('/login',home_controller.login)
home_router.get('/bill',home_controller.bill)
home_router.get('/bill_pdf',home_controller.bill_pdf)
export default home_router;