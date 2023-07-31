import listOrder from './listOrder';
async function createOrder(order, socket) {
    try {
        const { newOrder, orderDetail } = await listOrder.addOrder(order);
        socket.emit('createOrder', { order: { ...newOrder, detail: orderDetail }, code: 0 })
    } catch (error) {
        console.log(error)
        socket.emit('createOrder', { code: 1 })
    }
}
async function updateOrderDetail(order, socket) {
    await listOrder.addDetail(order.id, order.detail)
    socket.emit('getListOrder', listOrder.getOrders())
}
async function updateStatusDetail(detail, socket) {
    await listOrder.updateStatusDetail(detail.id, detail.status)
    socket.emit('getListOrder', listOrder.getOrders())
}
async function updateStatusOrder(order, socket) {
    await listOrder.updateStatusOrder(order.id, order.status)
    socket.emit('getListOrder', listOrder.getOrders())
}

function getCurrentTimeInVietnam() {
    const currentDate = new Date();
    const currentTimeInVietnam = new Date(currentDate.getTime());
    return currentTimeInVietnam;
}
export { createOrder, updateOrderDetail, getCurrentTimeInVietnam, updateStatusOrder, updateStatusDetail }