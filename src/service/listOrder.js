import { getCurrentTimeInVietnam } from "./order";
import { v4 as uuidv4 } from 'uuid';
class ListOrder {
  constructor() {
    this.orders = [];
    this.detail = [];
  }

  addOrder(order, detail) {
    this.orders.push(order);
    console.log(detail)
    detail.forEach(element => {
      this.detail.push(element)
    });

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
  }
  updateStatusDetail(id) {

  }
}
export default new ListOrder