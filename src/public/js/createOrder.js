import axios from "./axios.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
socket.on('connect', function () {
    socket.emit('authenticate', { token: localStorage.getItem('accessToken') });
    socket.on('err', (err) => {
        window.location.href = '/view/login'
    })
});
socket.on("disconnect", () => {
    console.log(socket.id);
});

const listOrder = [];
// (async () => {
//     const typeList = (await axios.get('/api/v1/type/get')).data.data
//     // Tạo danh sách các loại món ăn
//     const typeListElement = document.getElementById('listType');
//     typeList.forEach(function (food) {
//         const listItem = document.createElement('button');
//         listItem.setAttribute('class', 'btn btn-labeled btn-info mr-3')
//         listItem.innerText = food.name;
//         typeListElement.appendChild(listItem);
//     });
// })().catch(function (error) {
//     console.error('Không thể lấy danh sách loại', error);
// });
function addFood(food) {
    listOrder.push({ id_food: food.id, quantity: 1, price: food.price })
}

(async () => {
    const listFood = (await axios.get('/api/v1/food/get')).data.data
    const foodListElement = document.getElementById('listFood');
    listFood.forEach(function (food) {
        const listItem = document.createElement('div');
        listItem.setAttribute('class', "container-fluid")
        const div= document.createElement('div')
        div.setAttribute('class','shadow p-3 mb-1 bg-white rounded d-flex flex-row justify-content-center align-items-center')
        div.innerHTML = `
        <img src="${food.avatar}" class="rounded-circle shadow-4"
           style="width: 130px; height:auto" alt="Avatar" />
           <div class='col-6'>
           <p >${food.name}</p>
           <p >${food.price.toLocaleString('vi-VN', {style : 'currency', currency : 'VND'})}</p>
           </div>
    `
        const buttonElement = document.createElement('button');
        buttonElement.setAttribute('id',food.id)
        buttonElement.setAttribute('class','col-sm-2 btn btn-labeled btn-info mr-3 rounded-3 h-50')
        buttonElement.innerText = 'Thêm'
        buttonElement.addEventListener('click',(ev)=>{
            addFood(food)
        })
        div.appendChild(buttonElement)
        listItem.appendChild(div)
        foodListElement.appendChild(listItem);
    });
})().catch(function (error) {
    console.error('Không thể lấy danh sách món ăn', error);
});
document.getElementById('btn-add').addEventListener('click',createOrder)