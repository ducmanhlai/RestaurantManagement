import moment from 'moment';
import { readFileSync } from 'fs';
import Model from '../config/sequelize'
import auth from '../middleware/authenJWT';
import listOrder from 'service/listOrder';
import { saveBill } from 'service/bill';
import { Op } from 'sequelize';
import QRCode from 'qrcode';
var file = readFileSync('./infopayment.json');

const config = JSON.parse(file);

class pay_controller {
    async createTransaction(req, res) {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        var tmnCode = config.vnp_TmnCode;
        var secretKey = config.vnp_HashSecret;
        var vnpUrl = config.vnp_Url;
        var returnUrl = config.vnp_ReturnUrl;
        var date = new moment();
        var createDate = date.format('yyyyMMDDHHmmss');
        var orderId = req.body.orderId
        var amount = req.body.amount;
        var bankCode = req.body.bankCode;
        var orderInfo = req.body.orderDescription;
        var orderType = req.body.orderType;
        var locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        var currCode = 'VND';
        var vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = amount * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode;
        }
        vnp_Params = sortObject(vnp_Params);
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
        const acc = auth.tokenData(req);
        // try {
        //     ;
        //     let payment = { id_account: acc.id, id_method: 1, amount, date: new Date(), status: 1, id_order: orderId }
        //     PayModel.create(payment).then(data => {
        let qr = await QRCode.toDataURL(vnpUrl);
        res.send({
            code: 1,
            data: qr
        });
        console.log(vnpUrl)
        //     })
        // } catch (error) {
        //     console.log(error);
        //     res.send({
        //         message: 'Có lỗi xảy ra',
        //         data: []
        //     })
        // }

    }
    async handleResult(req, res) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var config = require('config');
        var secretKey = config.get('vnp_HashSecret');
        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];
            var rspCode = vnp_Params['vnp_ResponseCode'];
            //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
            if (rspCode == '00') {
                res.status(200).json({ RspCode: '00', Message: 'success' });
            }

        }
        else {
            res.status(200).json({ RspCode: '97', Message: 'Fail checksum' })
        }
    }
    async showResult(req, res) {
        var vnp_Params = req.query;
        var secureHash = vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);
        var tmnCode = config.vnp_TmnCode;
        var secretKey = config.vnp_HashSecret;

        var querystring = require('qs');
        var signData = querystring.stringify(vnp_Params, { encode: false });
        var crypto = require("crypto");
        var hmac = crypto.createHmac("sha512", secretKey);
        var signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex");
        if (secureHash === signed) {
            var orderId = vnp_Params['vnp_TxnRef'];
            res.redirect(`http://localhost:8080/view/bill_pdf?id=${orderId}&staff=${1}&type=online`)
        } else {
            res.send({ code: '97' })
        }
    }
}
function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}
export default new pay_controller()