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
    
  }