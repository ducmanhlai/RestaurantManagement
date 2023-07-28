import { v4 as uuidv4 } from 'uuid';
import Model from '../config/sequelize';
const orderModel = Model.order;
const orderDetailModel = Model.order_detail;
import listOrder from './listOrder';
async function createOrder(order, socket) {
    try {
       
       const {newOrder,orderDetail}= await listOrder.addOrder(order);
        console.log('call')
        socket.emit('createOrder', { order: { ...newOrder, detail: orderDetail }, code: 0 })
    } catch (error) {
        console.log(error)
        socket.emit('createOrder', { code: 1 })
    }

}
async function updateOrderDetail(order, socket) {
    listOrder.addDetail(order.id, order.detail)
    socket.emit('getListOrder', listOrder.getOrders())
}
async function updateStatusDetail(detail, socket) {
    listOrder.updateStatusDetail(detail.id, detail.status)
    socket.emit('getListOrder', listOrder.getOrders())
}
async function updateStatusOrder(order, socket) {
    listOrder.updateStatusOrder(order.id, order.status)
    socket.emit('getListOrder', listOrder.getOrders())
}

function getCurrentTimeInVietnam() {
    const currentDate = new Date();

    // Chuyển đổi múi giờ từ UTC (đơn vị: phút) sang múi giờ Việt Nam (UTC+7, đơn vị: phút)
    const vietnamTimeZoneOffset = 7 * 60; // UTC+7

    // Lấy thời gian hiện tại ở múi giờ Việt Nam (điều chỉnh thời gian dựa trên chênh lệch múi giờ) + vietnamTimeZoneOffset * 60000
    const currentTimeInVietnam = new Date(currentDate.getTime());

    return currentTimeInVietnam;
}
export { createOrder, updateOrderDetail, getCurrentTimeInVietnam, updateStatusOrder, updateStatusDetail }