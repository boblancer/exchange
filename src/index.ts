import BTree from "sorted-btree"
import { OrderRequest } from "./api/model/order_request"
import { Limit } from "./engine/limit"
import { Order } from "./engine/order"
import OrderBook from "./engine/order_book"

   
var o = new OrderBook("dogecoin")


o.processOrder( new OrderRequest(
    "sell", 30, 100
))

o.processOrder( new OrderRequest(
    "sell", 32, 20
))

o.processOrder( new OrderRequest(
    "buy", 31, 120
))


o.sellTree.forEachPair((key, value, index) => {
    console.log(key, "\n" ,value, "\n", index)
})

// o.sellTree.forEachPair((key, value, index) => {
//     console.log(key, "\n" ,value, "\n", index)
// })

// console.log("------------------------------")


var input = {
    "orders": [
    {"command": "sell", "price": 100.003, "amount": 2.4},
    {"command": "buy", "price": 90.394, "amount": 3.445}
    ]
}
