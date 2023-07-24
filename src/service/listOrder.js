class ListOrder {
    constructor() {
      this.orders = [];
    }
  
    addOrder(order) {
      this.orders.push(order);
    }
  
    getOrders() {
      return this.orders;
    }
    update(order){
      let id = order.id;
      this.orders = [...this.orders.map(item=>{
        if(item.id==id){
          console.log(id)
           return order
        }
        else return item
      })]
    }
  }
export default new ListOrder