import { getCurrentTimeInVietnam } from "./order";
import { v4 as uuidv4 } from 'uuid';
class ListOrder {
  constructor() {
    this.orders = [];
    this.detail = [];
  }

  addOrder(order, detail) {
    this.orders.push(order);
    detail.forEach(element => {
      this.detail.push(element)
    });

  }
  modifyStatus() {
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
  getOrders() {
    return this.orders.map(item => {
      return {
        ...item, detail: [...this.detail.filter(i => {
          return i.id_order.localeCompare(item.id) == 0
        })]
      }
    });
  }
  addDetail(id, listOrder) {
    listOrder.forEach(item => {
      this.detail.push({
        id: uuidv4(),
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
export default new ListOrder