import showToast from "./toast.js";
import { compareByStatus, compareByTime } from "./common.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import axios from "./axios.js";
import axiosApiInstance from "./interceptor.js";
const socket = io();
const orderTableBody = document.getElementById('orderTableBody');
var myModal = new bootstrap.Modal(document.getElementById('myModal'))
var payModal = new bootstrap.Modal(document.getElementById('ModalPay'))
socket.on('connect', function () {
  socket.emit('authenticate', { token: localStorage.getItem('accessToken') });
  socket.on('err', (err) => {
    window.location.href = '/view/login'
  })
});
let numOrder = 0;

socket.emit('getListOrder');
socket.on('getListOrder', renderListOrder)
socket.on('createOrder', () => {
  socket.emit('getListOrder');
})
socket.on("disconnect", () => {
  console.log(socket.id);
});
function formatTimeISO8601ToLocale(timeString) {
  return new Date(timeString).toLocaleString('vi-VN', {

  });
}
function renderOrder(order) {
  numOrder += 1;
  let totalAmout = 0;
  order.detail.forEach(item => {
    totalAmout += item.price * item.quantity
  })
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
   <th scope="row">${numOrder}</th>
   <td>${order.table}</td>
   <td>${totalAmout.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
   <td>${formatTimeISO8601ToLocale(order.time)}</td>
   <td>${order.status == 4 ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
   <td class="d-flex justify-content-around">
   <button type="button" class="btn btn-info ${order.status == 4 ? '' : 'btn-pay'}" id="${order.id}">${order.status == 4 ? '<i class="fa fa-check" aria-hidden="true"></i>' : 'Tính tiền'}</button>
   </td>
 `;
  newRow.querySelector('.btn-pay')?.addEventListener('click', function (e) {
    const li = e.target
    socket.emit('payOrder',
      {
        "id": li.id,
        "staff": 1
      })
  });
  newRow.setAttribute('id', order.id)
  orderTableBody.appendChild(newRow);
}

function renderListOrder(data) {
  // Xóa dữ liệu cũ trong bảng trước khi render dữ liệu mới
  orderTableBody.innerHTML = '';
  // Render dữ liệu mới vào bảng
  numOrder += data?.length || 0;
  data.sort(compareByStatus).forEach((order, index) => {
    let totalAmout = 0;
    order.detail.forEach(item => {
      totalAmout += item.status != 3 ? item.price * item.quantity : 0
    })
    const newRow = document.createElement('tr');
    newRow.setAttribute('class', 'animationFadeIn')
    newRow.innerHTML = `
            <th scope="row">${index + 1}</th>
            <td>${order.table}</td>
            <td>${totalAmout.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
            <td>${formatTimeISO8601ToLocale(order.time)}</td>
            <td>${order.status == 4 ? 'Đã thanh toán' : order.status == 3 ? 'Đã hủy' : 'Chưa thanh toán'}</td>
            <td class="d-flex justify-content-center">
            <button type="button" class="btn btn-info ${order.status < 3 ? 'btn-pay' : ''}" id="${order.id}">${order.status > 2 ? '<i class="fa fa-check" aria-hidden="true"></i>' : 'Thanh toán'}</button>
            <button type="button" data-amount='${totalAmout}' class="btn btn-info ${order.status < 3 ? 'btn-pay-online' : ''}" id="on${order.id}">${order.status > 2 ? '<i class="fa fa-check" aria-hidden="true"></i>' : 'Thanh toán trục tuyến'}</button>
            <button type="button" class="btn btn-info mr-2 ml-auto btn-i"  id="i${order.id}"><i class="fa fa-info" aria-hidden="true"></i></button>
            </td>
          `;
    newRow.querySelector('.btn-i')?.addEventListener('click', function (e) {
      let ele = e.target;
      let id = ele.id.replace('i', "");
      setTimeout(async () => {
        try {
          const data = (await axiosApiInstance.get(`/api/v1/order/get?id=${id}`)).data.data
          const modalBody = document.getElementById('modalBody')
          modalBody.innerHTML = ''
          data.order_details.forEach(item => {
            const listItem = document.createElement('div');
            listItem.setAttribute('class', "container-fluid")
            const div = document.createElement('div')
            div.setAttribute('class', 'shadow p-3 mb-1 bg-white rounded d-flex flex-row justify-content-center align-items-center animationMove')
            div.innerHTML = `
            <img src="${item.id_dish_food.avatar}" class="rounded-circle shadow-4"
               style="width: 130px; height:auto" alt="Avatar" />
               <div class='col-6'>
               <p >${item.id_dish_food.name}</p>
               <p >Số lượng: ${item.quantity}</p>
               <p >${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
               </div>
        `
            modalBody.appendChild(div)
            myModal.show()
          }, 1000)
        } catch (error) {
          showToast('Lỗi', error)
        }
      })
    });
    newRow.querySelector('.btn-pay')?.addEventListener('click', function (e) {
      const li = e.target
      socket.emit('payOrder',
        {
          "id": li.id,
          "staff": 1
        })
    });
    newRow.querySelector('.btn-pay-online')?.addEventListener('click', async function (e) {
      try {
        const li = e.target
        let id = li.id.replace('on', "");
        const imgElement = document.getElementById('img-qr')
        const data = (await axios.post('/api/v1/payment/create', {
          amount: Number.parseInt(li.dataset.amount),
          orderDescription: 'Thanh toán tiền cơm',
          orderType: 18,
          bankCode: 'NCB',
          orderId: Number.parseInt(id)
        })).data.data
        imgElement.setAttribute('src',data)
        payModal.show()
      } catch (error) {
        payModal.hide()
        showToast('Thông báo', 'Có lỗi xảy ra')
      }
    });
    newRow.setAttribute('id', order.id)
    orderTableBody.appendChild(newRow);
  });
}


