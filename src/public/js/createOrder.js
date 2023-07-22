import axios from "./axios.js";
(async () => {
    const typeList = (await axios.get('/api/v1/type/get')).data.data
    // Tạo danh sách các loại món ăn
    const typeListElement = document.getElementById('listType');
    typeList.forEach(function (food) {
        const listItem = document.createElement('button');
        listItem.setAttribute('class', 'btn btn-labeled btn-info mr-3')
        listItem.innerText = food.name; // Giả sử 'name' là thuộc tính chứa tên món ăn
        typeListElement.appendChild(listItem);
    });
})().catch(function (error) {
    console.error('Không thể lấy danh sách loại', error);
});
(async ()=>{
    const listFood = (await axios.get('/api/v1/food/get')).data.data
    // Tạo danh sách các loại món ăn
    const foodListElement = document.getElementById('listFood');
    listFood.forEach(function (food) {
        const listItem = document.createElement('div');
        listItem.setAttribute('class',"container-fluid")
        listItem.innerHTML =  `<div class="shadow p-3 mb-1 bg-white rounded row">
                 <p class='col-10'>${food.name}</p>
                 <button class='col'>Thêm</button>
        </div>`
        foodListElement.appendChild(listItem);
    });
})().catch(function (error) {
    console.error('Không thể lấy danh sách món ăn', error);
});
