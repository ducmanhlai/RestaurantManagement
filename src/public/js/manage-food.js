import showToast from "./toast.js";
import axiosApiInstance from './interceptor.js';
document.getElementById('btnSave').addEventListener('click', ManageFood);
document.getElementById('btn-add').addEventListener('click', () => {
    document.getElementById('modalLabel').innerText = "Thêm mới"
    console.log('clei')
})
var tableBody = document.getElementById('table-body');
var typeElement = document.getElementById('type');
(async () => {

    const data = (await axiosApiInstance.get('/api/v1/food/get')).data.data;
    data.forEach(function (item, index) {
        insert(item, index)
    });
    const type = (await axiosApiInstance.get('/api/v1/type/get')).data.data
    type.forEach(item => {
        typeElement.innerHTML += `<option value="${item.id}">${item.name}</option>`
    })
})().catch(err => showToast('Lỗi', err))
let idFood = 0
function insert(item, index) {
    var row = document.createElement('tr');
    var idCell = document.createElement('td');
    idCell.textContent = index + 1;
    row.appendChild(idCell);


    var imgCell = document.createElement('td');
    imgCell.setAttribute('style', "height: 100px;")
    var imgChild = document.createElement('img');
    imgChild.setAttribute('class', "rounded-circle img-fluid h-100");
    imgChild.setAttribute('src', item.avatar)
    imgCell.appendChild(imgChild)
    row.appendChild(imgCell);

    var nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    var phoneCell = document.createElement('td');
    phoneCell.textContent = item?.price;
    row.appendChild(phoneCell);


    var btn = document.createElement('td');
    let newbtn = document.createElement("button")
    newbtn.textContent = 'Sửa'
    newbtn.setAttribute('data-bs-target', '#exampleModal')
    newbtn.setAttribute("data-bs-toggle", "modal")
    newbtn.setAttribute('class', 'btn btn-primary')
    newbtn.addEventListener('click', () => getFood(item.id))
    btn.appendChild(newbtn)
    row.appendChild(btn);
    tableBody.appendChild(row);
}
function getFood(id) {
    (async () => {
        const data = (await axiosApiInstance.get(`/api/v1/food/get?id=${id}`)).data.data;
        idFood = data.id
        document.getElementById('modalLabel').innerText = "Chỉnh sửa"
        document.getElementById('name').value = data.name || "";
        document.getElementById('price').value = data.price || "";
        var optionValue = data.type || 2; // Giá trị của option mà bạn muốn chọn
        var optionElement = typeElement.querySelector('option[value="' + optionValue + '"]');
        if (typeElement) {
            optionElement.selected = true;
        } else {
            console.error('lỗi', optionValue);
        }
    })().catch(err => alert(err))
}
function ManageFood() {
    let name = document.getElementById('name').value;
    let price = document.getElementById('price').value;
    let typeFood = document.getElementById('type').value;
    let file = document.getElementById('file').files[0]
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('type', typeFood);
    formData.append('file', file);
    formData.append('id', idFood)
    if (idFood != 0) {

        (async () => {

            let data = (await axiosApiInstance.put(`/api/v1/food/modify`, formData,
                { headers: { "Content-Type": "multipart/form-data" } })).data
            showToast('Thông báo', data.message)
        })().catch(err => {
            showToast('Lỗi', err)
        }).finally(() => idFood = 0)
    }
    else {
        (async () => {
            document.getElementById('name').value = "";
            const data = (await axiosApiInstance.post(`/api/v1/food/create`, formData,
                { headers: { "Content-Type": "multipart/form-data" } })).data
            showToast('Thông báo', data.message)
        })().catch(err => {
            showToast('Lỗi', err)
        })
    }
}
