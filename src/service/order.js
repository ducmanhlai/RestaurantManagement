import { v4 as uuidv4 } from 'uuid';
import Model from '../config/sequelize';
const orderModel = Model.order;
const orderDetailModel = Model.order_detail;
import listOrder from './listOrder';
async function createOrder(order, socket) {
    try {
        let newOrder = {
            id: uuidv4(),
            time: getCurrentTimeInVietnam(),
            table: order.table,
            note: order.note,
            status: 1
        }
        const orderDetail = order.detail.map(item => {
            return {
                id: uuidv4(),
                time: newOrder.time,
                id_order: newOrder.id,
                quantity: item.quantity,
                id_food: item.id,
                status: 1,
                price: item.price
            }
        })
    
        listOrder.addOrder(newOrder,orderDetail);
        console.log('call')
        socket.emit('createOrder', { order: { ...newOrder, detail: orderDetail }, code: 0 })
    } catch (error) {
        console.log(error)
        socket.emit('createOrder', { code: 1 })
    }

}
async function updateOrderDetail(order, socket) {
    listOrder.addDetail(order.id,order.detail)
}
async function saveToDB(order) {
    // const id_staff = order.id_staff;
    // const time = new Date();
    // const table = order.table;
    // let newOrder = await orderModel.create({ id_staff, time, table });
    // console.log(newOrder.id)
    // const orderDetail = order.detail.map(item=>{
    //     return {
    //         id_order: newOrder.id,
    //         quantity: item.quantity,
    //         id_dish:item.id_dish,
    //         status:1,
    //         price:item.price
    //     }
    // })
    // const listOrderDetail = await orderDetailModel.bulkCreate([...orderDetail]);
}
function getCurrentTimeInVietnam() {
    const currentDate = new Date();

    // Chuyển đổi múi giờ từ UTC (đơn vị: phút) sang múi giờ Việt Nam (UTC+7, đơn vị: phút)
    const vietnamTimeZoneOffset = 7 * 60; // UTC+7

    // Lấy thời gian hiện tại ở múi giờ Việt Nam (điều chỉnh thời gian dựa trên chênh lệch múi giờ) + vietnamTimeZoneOffset * 60000
    const currentTimeInVietnam = new Date(currentDate.getTime());

    return currentTimeInVietnam;
}
export { createOrder, updateOrderDetail,getCurrentTimeInVietnam }