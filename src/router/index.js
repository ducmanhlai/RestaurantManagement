import home_router from "./home";
import auth_router from "./auth";
import admin_router from "./admin";
import type_router from './type';
import food_router from "./food";
export default function router(app) {
   app.use('/view',home_router);
   app.use('/api/v1/auth',auth_router)
   app.use('/api/v1/admin',admin_router)
   app.use('/api/v1/type',type_router)
   app.use('/api/v1/food',food_router)
 }
 