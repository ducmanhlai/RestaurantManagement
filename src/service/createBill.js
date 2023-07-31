const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


export default function createBill(id) {
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
    // Khởi động trình duyệt Puppeteer

  })();
}