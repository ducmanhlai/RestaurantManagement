import { Router } from "express";
import home_controller from "controller/home_controller";
const home_router= Router();
home_router.get('/home',home_controller.home);
home_router.get('/menu',home_controller.menu);
home_router.get('/staff',home_controller.staff);
home_router.get('/statistics',home_controller.statistics);
home_router.get('/login',home_controller.login)
export default home_router;