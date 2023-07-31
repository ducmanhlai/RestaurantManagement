import axios from "./axios.js";
const bill_element = document.getElementById('bill-no');
const table_element = document.getElementById('table-no');
const date_element = document.getElementById('date');
const time_element = document.getElementById('time');
const detail_element = document.getElementById('table-detail');
const total_element = document.getElementById('total');
const staff_element = document.getElementById('staff');
function formatTimeISO8601ToLocale(timeString) {
    return new Date(timeString).toLocaleString('vi-VN', {
      });
  }
(async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('id')
    let total= 0
    const order = (await axios.get(`/api/v1/order/get?id=${id}`)).data.data
    bill_element.innerHTML = `Số hóa đơn: ${order.id}`
    table_element.innerHTML = `Bàn: ${order.table}`
    order.order_details.forEach(item => {
        total+= item.price*item.quantity
        renderDetail(item)
    })
    date_element.innerText= `Thời gian: ${formatTimeISO8601ToLocale(order.time)}`
    staff_element.textContent= `Nhân viên: ${order.id_staff_staff.name}`
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