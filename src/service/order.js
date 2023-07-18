import Model from '../config/sequelize';
const orderModel = Model.order;
const orderDetailModel = Model.order_detail;
async function createOrder(order,socket) {
    try {
        const id_staff = order.id_staff;
        const time = new Date();
        const table = order.table;
        let newOrder = await orderModel.create({ id_staff, time, table });
        console.log(newOrder.id)
        const orderDetail = order.detail.map(item=>{
            return {
                id_order: newOrder.id,
                quantity: item.quantity,
                id_dish:item.id_dish,
                status:1,
                price:item.price
            }
        })
        const listOrderDetail = await orderDetailModel.bulkCreate([...orderDetail]);
        socket.emit('createOrder',{newOrder,listOrderDetail,code:0})
    } catch (error) {
        console.log(error)
        socket.emit('createOrder',{newOrder,orderDetail,code:1})
    }
   

}
export {createOrder}