const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
import Model from '../config/sequelize'
function createBill(id) {
  (async () => {
    try {
      const browser = await puppeteer.launch({ headless: false });

      // Mở trang web hiện tại
      const page = await browser.newPage();
      await page.goto(`http://localhost:8080/view/bill_pdf?id=${id}`);
      // await page.show();
      // Lấy nội dung HTML của trang
      const html = await page.evaluate(() => document.querySelector('html').outerHTML);

      // Tạo tệp PDF từ nội dung HTML
      await page.pdf({ path: path.join(__dirname, `../../bill/bill-${id}.pdf`) });

      // Đóng trình duyệt
      // await browser.close();
    } catch (error) {
      console.log(error)
    }
  })();
}
async function saveBill(order, staff) {
  let total = 0;
  order.order_details.forEach(element => {
    total += element.price * element.quantity
  });
  const newBill = {
    id_order: order.id,
    id_staff: staff,
    time: new Date(),
    pay_method: 'cash',
    discount:0,
    total: total
  }
  const bill = await Model.bill.create(newBill);
  return bill
}
export { createBill, saveBill }