import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { createOrder, updateOrderDetail, updateStatusDetail, updateStatusOrder } from "service/order";
import listOrder from "service/listOrder";

export default function socket(server) {
  const io = new Server(server);
  io.on('connection', function (socket) {
    socket.auth = false;
    socket.on('authenticate', function (data) {
      jwt.verify(data.token, process.env.ACCESS_KEY, (err, data) => {
        if (err) {
          console.log(err);
          socket.emit("err", err)
        }
        console.log(socket.auth)
        socket.auth = true;
        socket.emit('authenticate', 'Xác thực thành công')
      })
    });
    socket.on('createOrder', data => {
      createOrder(data, io).catch(err => { console.log(err) })
    })
    socket.on('updateOrderDetail', data => {
      updateOrderDetail(data, io)
    })
    socket.on('updateStatusDetail', data => {
      updateStatusDetail(data,io)
    })
    socket.on('updateStatusOrder', data => {
      updateStatusOrder(data,io)
    })
    socket.on('getListOrder', data => {
      socket.emit('getListOrder', listOrder.getOrders())
    })
    setTimeout(() => {
      console.log(socket.auth)
    }, 3000)
  })
}