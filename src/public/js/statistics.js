import axios from "./axios.js";

(async ()=>{
    const ctx = document.getElementById('topSaleChart');
    const topSale= (await axios.get('/api/v1/statistics/topSelling')).data.data
    let total =0;
    topSale.forEach(element => {
        total+= element.num
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
            labels: topSale.map(element=>{
                return element.id_dish_food.name
            }),
            datasets: [{
                label: 'Phần trăm',
                data: topSale.map(element=>{
                    return element.num/total*100
                }),
                borderWidth: 1
            }]
        },
        options: options
    });
})()