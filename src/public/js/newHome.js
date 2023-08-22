import showToast from "./toast.js";
import { compareByStatus, compareByTime } from "./common.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import axios from "./axios.js";
import axiosApiInstance from "./interceptor.js";
var listTable = []
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
socket.on('getListOrder', renderTable)
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
function Init() {
    (async () => {
        const data = (await axiosApiInstance.get('/api/v1/table/get')).data.data
        listTable = [...data]
        const listTableElement = document.getElementById('listTable')
        data.forEach(element => {
            const div = document.createElement('div');
            div.setAttribute('class', 'table-element');
            div.setAttribute('id', element.id);
            div.innerText = element.name;
            div.addEventListener('click', () => {
                numOrder = element.id;
                showModal().then().catch((err)=>{
                    console.log('có lỗi',err)
                })
            })
            listTableElement.appendChild(div);
        })
    })().then().catch(err => {
        showToast('Thông báo', 'Có lỗi xảy ra');
    })
}
function renderTable(data) {
    console.log(listTable)
    if (listTable.length == 0)
        return
    else {
        listTable.forEach(element => {
            const tableElement = document.getElementById(element.id);
            if (checkTable(element.id, data)) {
                tableElement.setAttribute('class', 'table-element-select')
            }
            else {
                tableElement.setAttribute('class', 'table-element')
            }
        });
    }
}
function checkTable(id, data) {
  
    for (let i of data) {
        if (i.table == id && i.status < 3)
            return true
    }
    return false
}
async function showModal() {
    var listStatus = ['Đã gọi', 'Đã hoàn thành', 'Đã hủy', 'Đã thanh toán']
    const data = (await axiosApiInstance.get(`/api/v1/order/get-by-table?id=${numOrder}`)).data.data
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
         <p >Trạng thái: ${listStatus[item.status - 1]}</p>
         <p >${item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
         </div>
  `
        modalBody.appendChild(div)
        myModal.show()
    })
}
Init()


