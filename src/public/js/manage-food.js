import showToast from "./toast.js";
import axiosApiInstance from './interceptor.js';
document.getElementById('btnSave').addEventListener('click', ManageFood);
var myModal = new bootstrap.Modal(document.getElementById('myModal'))
document.getElementById('btn-add').addEventListener('click', () => {
    document.getElementById('file').value ='';
    document.getElementById('modalLabel').innerText = "Thêm mới"
})
var tableBody = document.getElementById('table-body');
var typeElement = document.getElementById('type');
async function getData(){
    tableBody.innerHTML=''
    const data = (await axiosApiInstance.get('/api/v1/food/get')).data.data;
    data.forEach(function (item, index) {
        insert(item, index)
    });
   
}
(async () => {
    const type = (await axiosApiInstance.get('/api/v1/type/get')).data.data
    type.forEach(item => {
        typeElement.innerHTML += `<option value="${item.id}">${item.name}</option>`
    })
   await getData()
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
    imgChild.setAttribute('loading',"lazy")
    imgCell.appendChild(imgChild)
    row.appendChild(imgCell);

    var nameCell = document.createElement('td');
    nameCell.textContent = item.name;
    row.appendChild(nameCell);

    var priceCell = document.createElement('td');
    priceCell.textContent = item?.price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});;
    row.appendChild(priceCell);


    var btn = document.createElement('td');
    let newbtn = document.createElement("button")
    newbtn.textContent = 'Sửa'
    newbtn.setAttribute('data-bs-target', '#myModal')
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
            myModal.hide()
            showToast('Thông báo', data.message)
            getData()
        })().catch(err => {
            myModal.hide()
            showToast('Lỗi', err)
        }).finally(() => 
        idFood = 0)
    }
    else {
        (async () => {
            document.getElementById('name').value = "";
            const data = (await axiosApiInstance.post(`/api/v1/food/create`, formData,
                { headers: { "Content-Type": "multipart/form-data" } })).data
                myModal.hide()
            getData()
            showToast('Thông báo', data.message)
        })().catch(err => {
            myModal.hide()
            showToast('Lỗi', err)
        })
    }
}
