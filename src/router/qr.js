import { Router } from "express";
import auth_controller from "controller/auth_controller";
import  QRCode  from "qrcode";
const qr_router = Router();
qr_router.post('/create',async (req,res)=>{
    let qr = await QRCode.toDataURL(req.body.url);
    let img='';
    img = `<image src= " `+qr+ `" />`
    return res.send(img);
});
export default qr_router