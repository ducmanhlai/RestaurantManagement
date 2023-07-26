const puppeteer = require('puppeteer');


export default function createBill() {
    (async () => {
        // Khởi động trình duyệt Puppeteer
        const browser = await puppeteer.launch({headless: false});
      
        // Mở trang web hiện tại
        const page = await browser.newPage();
        await page.goto('http://localhost:8080/view/bill_pdf');
      
        // Lấy nội dung HTML của trang
        const html = await page.evaluate(() => document.querySelector('html').outerHTML);
      
        // Tạo tệp PDF từ nội dung HTML
        await page.pdf({ path: 'output.pdf' });
      
        // Đóng trình duyệt
        await browser.close();
      })();
}