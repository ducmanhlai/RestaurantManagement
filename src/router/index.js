import home_router from "./home";
import auth_router from "./auth";
import admin_router from "./admin";
import type_router from './type';
import food_router from "./food";
import table_router from "./table";
import user_router from "./user";
import status_order_router from "./status_order";
export default function router(app) {
   app.use('/view',home_router);
   app.use('/api/v1/auth',auth_router);
   app.use('/api/v1/admin',admin_router);
   app.use('/api/v1/type',type_router);
   app.use('/api/v1/food',food_router);
   app.use('/api/v1/table',table_router);
   app.use('/api/v1/user',user_router);
   app.use('/api/v1/status_order',status_order_router);
 }
 