import { v4 as uuidv4 } from 'uuid';
import Model from '../config/sequelize';
const orderModel = Model.order;
const orderDetailModel = Model.order_detail;
import listOrder from './listOrder';
async function createOrder(order,socket) {
    try {
        let newOrder = {
            id: uuidv4(),
            time: new Date(),
            table: order.table
        }
        const orderDetail = order.detail.map(item=>{
                return {
                    id_order: newOrder.id,
                    quantity: item.quantity,
                    id_dish:item.id_dish,
                    status:1,
                    price:item.price
                }
            })
        listOrder.addOrder({...newOrder,detail:orderDetail});
        socket.broadcast.emit('createOrder',{order:{...newOrder,detail:orderDetail},code:0})
    } catch (error) {
        console.log(error)
        socket.emit('createOrder',{code:1})
    }
   

}
async function saveToDB(order){
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
export {createOrder}