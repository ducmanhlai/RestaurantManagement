import axios from "./axios.js";
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
const socket = io();
socket.emit('getListOrder');
socket.on('getListOrder', data => {
    const div = document.getElementById('orderInday')
    div.innerText = data?.length || 0;
})

socket.on("disconnect", () => {
    console.log(socket.id);
});
socket.on('connect', function () {
    socket.emit('authenticate', { token: localStorage.getItem('accessToken') });
    socket.on('err', (err) => {
        window.location.href = '/view/login'
    })
});
const ctx = document.getElementById('topSaleChart');
const topProductCharElement = document.getElementById('topProductChart')
const listBgColor = [' bg-danger', 'bg-warning', '', ' bg-info', 'bg-success','bg-violet'];
var char
(async () => {
    const data = (await axios.get('/api/v1/statistics/topSelling')).data.data;
    let topSale = [...data.topSelling]
    let totalProduct = data.total;
    let total = 0
    topSale.forEach(element => {
        total += element.num
    });
    topSale.push({
        num: totalProduct - total,
        id_dish_food: {
            name: "Khác"
        }
    })
    const options = {
        tooltips: {
            enabled: true
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    return `${value} %`;
                },
                color: '#fff',
            }
        },
      
    };
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topSale.map(element => {
                return element.id_dish_food.name
            }),
            datasets: [{
                label: 'Phần trăm',
                data: topSale.map(element => {
                    return element.num / totalProduct * 100
                }),
                borderWidth: 1
            }]
        },
        options: options
    });
})().finally();
(async () => {
    let total = 0
    const revenueElement = document.getElementById('revenueInDay');
    const revenueMonthElement = document.getElementById('revenueInMonth');
    const req1 = axios.get('/api/v1/statistics/day');
    const req2 = axios.get(`/api/v1/statistics/revenue?month=${new Date().getMonth() + 1}`)
    const req3 = axios.get(`/api/v1/statistics/revenue`)
    const result = await Promise.all([req1, req2, req3])
    const revenue = result[0].data.data
    const revenueMonth = result[1].data.data
    revenueMonth.forEach(item => { total += Number.parseInt(item) })
    revenueMonthElement.innerText = total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
    revenueElement.innerText = Number.parseInt( revenue[0].total==null? 0 : revenue[0].total).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    handleChart(result[2].data.data, 'year')
})().finally()
function handleChart(data, type) {
    const revenueChart = document.getElementById('revenueChart');
    revenueChart.style.width = "90%";
    revenueChart.style.height = "80%";
    const options = {
        tooltips: {
            enabled: true
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    return `${value} %`;
                },
                color: '#fff',
            }
        },
        scales: {
            y: {
              beginAtZero: true
            },
          
        }
    };
    if (type.localeCompare('year') == 0) {
        const monthlyTotals = new Array(12).fill(0);
        // Điền giá trị total vào mảng


        char = new Chart(revenueChart, {
            type: 'line',
            data: {
                labels: data.map((element, index) => {
                    return `${index + 1}`
                }),
                datasets: [{
                    label: 'VND',
                    data: data,
                    borderWidth: 1
                }]
            },
            options: options
        });
    }
}
const monthElement = document.getElementById('month');
const yearElement = document.getElementById('year');
function handleInputTime() {
    monthElement.addEventListener('change', ev => {
        (async () => {
            const a = ev.target.value
            let data = (await axios.get(`/api/v1/statistics/revenue?year=${yearElement.value}${a != 0 ? '&month=' + a : ''}`)).data.data;
            char.data.datasets[0].data = data;
            char.data.labels = data.map((element, index) => {
                return `${index + 1}`
            })
            char.update()
        })().catch(err => {
            console.log(err)
        })
    })
    yearElement.addEventListener('change', ev => {
        (async () => {
            const a = ev.target.value
            let data = (await axios.get(`/api/v1/statistics/revenue?year=${yearElement.value}`)).data.data
            char.data.datasets[0].data = data;
            char.data.labels = data.map((element, index) => {
                return `${index + 1}`
            })
            char.update()
        })().catch(err => {
            console.log(err)
        })
    })
}
handleInputTime()
async function chartTopProducts() {
    let data = (await axios.get(`/api/v1/statistics/topProduct`)).data.data;
    let listProduct = [...data.topSelling]
    let total = 0;
    listProduct.forEach((item=>{
        total+= Number.parseInt(item.total)
    }))
    let totalAmount = data.total
    listProduct.push(   {
        "total":totalAmount- total,
        "id_dish": 4,
        "id_dish_food": {
            "name": "Khác"
        }
    })
    listProduct.forEach((item, index) => {
        const chartElement = document.createElement('div');
        let percent = (item.total / totalAmount * 100).toFixed(2)
        chartElement.setAttribute('class', 'fs-16 font-weight-bold')
        chartElement.innerHTML = `<h4 class="font-weight-bold fs-16" style="font-size:0.9rem">${item.id_dish_food.name}<span class="float-right">${percent}%</span></h4>
        <div class="progress">
        <div class="progress-bar ${listBgColor[index]}" role="progressbar"
        style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0"
        aria-valuemax="100"></div>
        </div>`
        topProductCharElement.appendChild(chartElement)
    })
}
chartTopProducts().catch(err => {
    console.log(err)
})