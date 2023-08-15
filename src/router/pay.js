import { Router } from "express";
import pay_controller from "../controller/pay_controller"
const paymentRouter = Router();
import auth from "../middleware/authenJWT";

paymentRouter.post('/create', pay_controller.createTransaction)
paymentRouter.get('/vnpay_ipn',  pay_controller.handleResult);
paymentRouter.get('/return', pay_controller.showResult)
export default paymentRouter;
