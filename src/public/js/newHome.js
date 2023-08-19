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
            div.setAttribute('id', element.id)
            div.innerText = element.name;
            listTableElement.appendChild(div)
        })
    })().then().catch(err => {
        showToast('Thông báo', 'Có lỗi xảy ra');
    })
}
function renderTable(data) {
    
    if (listTable.length == 0)
        return
    else {
        listTable.forEach(element => {
            const tableElement = document.getElementById(element.id);
            console.log(checkTable(element.id,data))
            if(checkTable(element.id,data)){
                
                tableElement.setAttribute('class','table-element-select')
            }
            else{
                tableElement.setAttribute('class','table-element')
            }
        });
    }
}
function checkTable(id,data) {
    for (let i of data) {
        if ( i.table== id && i.status < 3)
            return true
    }
    return false
}
Init()



