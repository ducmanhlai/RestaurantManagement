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
document.getElementById('btn-add').addEventListener('click',createOrder)
const listOrder = [];
(async () => {
    const typeList = (await axios.get('/api/v1/type/get')).data.data
    // Tạo danh sách các loại món ăn
    const typeListElement = document.getElementById('listType');
    typeList.forEach(function (food) {
        const listItem = document.createElement('button');
        listItem.setAttribute('class', 'btn btn-labeled btn-info mr-3')
        listItem.innerText = food.name;
        typeListElement.appendChild(listItem);
    });
})().catch(function (error) {
    console.error('Không thể lấy danh sách loại', error);
});
function addFood(food) {
    listOrder.push({ id: food.id, quantity: 1, price: food.price })
}
function createOrder() {
    const order = {
        "id_staff": 2,
        "table": 21,
        "note": "Bỏ ít ớt thôi, không cho đườngg",
        'detail': [...listOrder]
    }
    console.log(order)
}
(async () => {
    const listFood = (await axios.get('/api/v1/food/get')).data.data

    const foodListElement = document.getElementById('listFood');
    listFood.forEach(function (food) {
        const listItem = document.createElement('div');
        listItem.setAttribute('class', "container-fluid")
        const div= document.createElement('div')
        div.setAttribute('class','shadow p-3 mb-1 bg-white rounded row')
        div.innerHTML = `
                 <p class='col-10'>${food.name}</p>`
        const buttonElement = document.createElement('button');
        buttonElement.setAttribute('id',food.id)
        buttonElement.setAttribute('class','col')
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
