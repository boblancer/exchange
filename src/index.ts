import OrderBook from "./engine/order_book"

   
var o = new OrderBook("dogecoin")
console.log(o.buyTree.minKey() == undefined)