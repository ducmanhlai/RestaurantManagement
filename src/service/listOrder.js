import { getCurrentTimeInVietnam } from "./order";
import { v4 as uuidv4 } from 'uuid';
import Model from '../config/sequelize';
const detailModel = Model.order_detail
const orderModel = Model.order
class ListOrder {
  constructor() {
    this.orders = [];
    this.detail = [];
  }

  async addOrder(order) {
    const newOrder = await saveOrder(order);
    const listPromise = []
    this.orders.push(newOrder);
    order.detail.forEach(element => {
      listPromise.push(saveDetail(newOrder, element))
    });
    const orderDetail = await Promise.all(listPromise)
    orderDetail.forEach(item => {
      this.detail.push(item)
    })
    return { newOrder: newOrder.dataValues, orderDetail }
  }
  async modifyStatus() {
    for (let order of this.orders) {
      let cancel = 0
      let finish = 0
      let count = 0
      for (let detail of this.detail) {
        if (detail.id_order.localeCompare(order.id) == 0) {
          count -= -1
          if (detail.status == 3)
            cancel += 1
          if (detail.status == 4)
            finish += 1
        }
      }
      if (cancel == count) this.updateStatusOrder(order.id, 3)
      else
        if (finish == count) this.updateStatusOrder(order.id, 4)
        else this.updateStatusOrder(order.id, 1)

    }
  }
  async getOrders() {
    return this.orders.map(item => {
      return {
        ...item, detail: [...this.detail.filter(i => {
          return i.id_order.localeCompare(item.id) == 0
        })]
      }
    });
  }
  async addDetail(id, listDetail) {
    listDetail.forEach(item => {
      this.detail.push({
        id: item.id,
        id_order: id,
        quantity: item.quantity,
        id_food: item.id_food,
        status: 1,
        price: item.price,
        time: getCurrentTimeInVietnam()
      })
    })
    this.modifyStatus()
  }
  updateStatusDetail(id, status) {
    this.detail = [...this.detail.map(item => {
      if (item.id.localeCompare(id) == 0) {
        return {
          ...item,
          status: status
        }
      }
      return item
    })]
    this.modifyStatus()
  }
  updateStatusOrder(id, status) {
    this.orders = [...this.orders.map(item => {
      if (item.id.localeCompare(id) == 0) {
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
  let newOrder = await orderModel.create({ id_staff, time, table,note:order.note });
  return newOrder
}
async function saveDetail(order, detail) {
  const newDetail = await detailModel.create({
    id_order: order.id,
    quantity: detail.quantity,
    id_food: detail.id_food,
    status: 1,
    price: detail.price,
    time: getCurrentTimeInVietnam()
  })
  return newDetail
}
export default new ListOrder