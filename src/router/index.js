import { Router } from "express";
import home_router from "./home";
import auth_router from "./auth";
export default function router(app) {
   app.use('/view',home_router);
   app.use('/api/v1/auth',auth_router)
 }
 