import axios from "./axios.js";
const ctx = document.getElementById('topSaleChart');
const listBgColor = [' bg-danger', 'bg-warning', '', ' bg-info', 'bg-success'];
var char
(async () => {
    const topSale = (await axios.get('/api/v1/statistics/topSelling')).data.data;
    let total = 0;
    topSale.forEach(element => {
        total += element.num
    });
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
        }
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
                    return element.num / total * 100
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
    revenueElement.innerText = revenue[0].total?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || 0;
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
function chartTopProducts() {
    // <h4 class="small font-weight-bold">Account Setup <span
    //                                                     class="float-right">Complete!</span></h4>
    //                                             <div class="progress">
    //                                                 <div class="progress-bar bg-success" role="progressbar"
    //                                                     style="width: 100%" aria-valuenow="100" aria-valuemin="0"
    //                                                     aria-valuemax="100"></div>
    //                                             </div>
}