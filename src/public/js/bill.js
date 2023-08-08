import axios from "./axios.js";
const bill_element = document.getElementById('bill-no');
const table_element = document.getElementById('table-no');
const date_element = document.getElementById('date');
const detail_element = document.getElementById('table-detail');
const staff_element = document.getElementById('staff');
function formatTimeISO8601ToLocale(timeString) {
    return new Date(timeString).toLocaleString('vi-VN', {
      });
  }
(async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    const staff = urlParams.get('staff')
    let total= 0
    const order = (await axios.get(`/api/v1/order/get?id=${id}&staff=${staff}`)).data.data
    const staffPay = (await axios.get(`/api/v1/admin/staff/get?id=${staff}`)).data.data
    console.log(staffPay)
    bill_element.innerHTML = `Số hóa đơn: ${order.id}`
    table_element.innerHTML = `Bàn: ${order.table}`
    order.order_details.forEach(item => {
        total+= item.price*item.quantity
        renderDetail(item)
    })
    date_element.innerText= `Thời gian: ${formatTimeISO8601ToLocale(order.time)}`
    staff_element.textContent= `Nhân viên: ${staffPay?.staffs[0].name || 'admin'}`
    addFooterTable('Giảm giá', 0,null,'discount')
    addFooterTable('Tổng cộng', total,'net-amount','total')
})().catch(function (error) {
    console.error('Có lỗi xảy ra', error);
})
function addFooterTable(title,num,className='',id='') {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
   <td class= "${className}" id="${id}"></td>
   <td>${title}</td>
   <td></td>
   <td>${num.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</td>
 `;
    detail_element.appendChild(newRow);
}
function renderDetail(order) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
   <td>${order.id_dish_food?.name}</td>
   <td>${order.price.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</td>
   <td>${order.quantity}</td>
   <td>${(order.price * order.quantity).toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</td>
 `;
    detail_element.appendChild(newRow);
}