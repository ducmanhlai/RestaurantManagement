import showToast from "./toast.js";
import { compareByStatus,compareByTime } from "./common.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
const orderTableBody = document.getElementById('orderTableBody');
socket.on('connect', function () {
    socket.emit('authenticate', { token: localStorage.getItem('accessToken') });
    socket.on('err', (err) => {
        window.location.href = '/view/login'
    })
});
let numOrder = 0;
var myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
socket.emit('getListOrder');
socket.on('getListOrder',renderListOrder)
socket.on('createOrder',()=>{
  socket.emit('getListOrder');
})
socket.on('payOrder',()=>{
  myModal.show();
  
})
socket.on("disconnect", () => {
    console.log(socket.id);
});
function formatTimeISO8601ToLocale(timeString) {
    return new Date(timeString).toLocaleString('vi-VN', {
        
      });
  }
function renderOrder(order){
   numOrder+=1;
   let totalAmout= 0;
   order.detail.forEach(item=>{
       totalAmout+=item.price*item.quantity
   })
   const newRow = document.createElement('tr');
   newRow.innerHTML = `
   <th scope="row">${numOrder}</th>
   <td>${order.table}</td>
   <td>${totalAmout.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
   <td>${formatTimeISO8601ToLocale(order.time)}</td>
   <td>${order.status==4 ? 'Đã thanh toán': 'Chưa thanh toán'}</td>
   <td class="d-flex justify-content-around">
   <button type="button" class="btn btn-info ${order.status==4 ? '':'btn-pay'}" id="${order.id}">${order.status==4 ? '<i class="fa fa-check" aria-hidden="true"></i>': 'Tính tiền'}</button>
   </td>
 `;
 newRow.querySelector('.btn-pay')?.addEventListener('click', function(e) {
  const li = e.target
  socket.emit('payOrder',
  {
      "id":li.id,
      "staff":1
  })
});
newRow.setAttribute('id',order.id)
  orderTableBody.appendChild(newRow);

}

function renderListOrder(data) {
        // Xóa dữ liệu cũ trong bảng trước khi render dữ liệu mới
        orderTableBody.innerHTML = '';
        // Render dữ liệu mới vào bảng
        numOrder+= data?.length || 0;
        data.sort(compareByStatus).forEach( (order,index) => {
            let totalAmout= 0;
            order.detail.forEach(item=>{
                totalAmout+=item.price*item.quantity
            })
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
            <th scope="row">${index+1}</th>
            <td>${order.table}</td>
            <td>${totalAmout.toLocaleString('it-IT', {style : 'currency', currency : 'VND'})}</td>
            <td>${formatTimeISO8601ToLocale(order.time)}</td>
            <td>${order.status==4 ? 'Đã thanh toán': 'Chưa thanh toán'}</td>
            <td class="d-flex justify-content-around">
            <button type="button" class="btn btn-info ${order.status==4 ? '':'btn-pay'}" id="${order.id}">${order.status==4 ? '<i class="fa fa-check" aria-hidden="true"></i>': 'Tính tiền'}</button>
            </td>
          `;
          newRow.querySelector('.btn-pay')?.addEventListener('click', function(e) {
            const li = e.target
            socket.emit('payOrder',
            {
                "id":li.id,
                "staff":1
            })
          });
          newRow.setAttribute('id',order.id)
            orderTableBody.appendChild(newRow);
        });
}


