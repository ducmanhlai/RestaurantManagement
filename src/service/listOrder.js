import { Op } from "sequelize";
import { getCurrentTimeInVietnam } from "./order";
import Model from '../config/sequelize';
const detailModel = Model.order_detail
const orderModel = Model.order
class ListOrder {
  constructor() {
    this.orders = [];
    this.detail = [];
    this.init()
  }
  init() {
    (async () => {
      const today = new Date();
      const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()-1,today.getHours(), 0, 0, 0, 0);
      const end = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1 );
      const listInit = []
      listInit.push(orderModel.findAll({
        where: {
          time: {
            [Op.between]: [start, end],
          }
        }
      }))
      listInit.push(detailModel.findAll({
        where: {
          time: {
            [Op.between]: [start, end],
          }
        }
      }))
      const [order, detail] = await Promise.all(listInit)
      this.orders = [...order.map(item => item.dataValues)]
      this.detail = [...detail.map(item => item.dataValues)]
    })()
  }
  async addOrder(order) {
    const newOrder = await saveOrder(order);
    this.orders.push(newOrder);
    const orderDetail = await Promise.all(order.detail.map(element => saveDetail(newOrder, element)));
    orderDetail.forEach(item => {
      this.detail.push(item)
    })
    return { newOrder: newOrder, orderDetail }
  }
  async modifyStatus() {
    for (let order of this.orders) {
      let cancel = 0
      let finish = 0
      let count = 0
      for (let detail of this.detail) {
        if (detail.id_order == order.id) {
          count += 1
          if (detail.status == 3)
            cancel += 1
          if (detail.status == 4)
            finish += 1
        }
      }
      if (
        order.status != 4
      ) {
        if (cancel == count) await this.updateStatusOrder(order.id, 3)
        else
          if (finish == count) await this.updateStatusOrder(order.id, 2)
          else await this.updateStatusOrder(order.id, 1)
      }
    }
  }

  getOrders() {
    return this.orders.map(item => {
      return {
        ...item,
        status: item.status,
        detail: [...this.detail.filter(i => {
          return i.id_order == item.id
        })]
      }
    });
  }
  async addDetail(id, listDetail) {
    const newDetail = await Promise.all(listDetail.map(element => saveDetail({ id: id }, element)));
    newDetail.forEach(item => {
      this.detail.push(item)
    })
    await this.modifyStatus()
  }
  async updateStatusDetail(id, status) {
    const detail = await detailModel.findByPk(id);
    detail.status = status;
    await detail.save();
    this.detail = [...this.detail.map(item => {
      if (item.id == id) {
        return {
          ...item,
          status: status
        }
      }
      return item
    })]
    await this.modifyStatus()
  }
  async updateStatusOrder(id, status) {
    const order = await orderModel.findByPk(id);
    order.status = status;
    await order.save();
    this.orders = [...this.orders.map(item => {
      if (item.id == id) {
        return {
          ...item,
          status: status
        }
      }
      else return item
    })]
  }
}
async function saveOrder(order) {
  const id_staff = order.id_staff;
  const time = new Date();
  const table = order.table;
  let newOrder = await orderModel.create({ id_staff, time, table, note: order.note, status: 1 });
  return newOrder.dataValues
}
async function saveDetail(order, detail) {
  const newDetail = await detailModel.create({
    id_order: order.id,
    quantity: detail.quantity,
    id_dish: detail.id_food,
    status: 1,
    price: detail.price,
    time: getCurrentTimeInVietnam()
  })
  return newDetail.dataValues
}
export default new ListOrder