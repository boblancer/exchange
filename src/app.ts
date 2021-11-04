import BTree, { simpleComparator } from "sorted-btree"
import { OrderRequest } from "./api/model/order_request"
import OrderBook, { Command } from "./matching_engine/order_book"

function printT(tree: BTree){
    tree.forEachPair((key, value, index) => {
        console.log(value, index)
    })
    
}

function batchOrder(input: string[], o: OrderBook){
    input.forEach(s => {
        const or: OrderRequest = JSON.parse(s)
        o.processCommand(or)
    });
}

let c1 = [
    '{"command": "sell", "price": 100.003, "amount": 2.4}',
    '{"command": "buy", "price": 90.394, "amount": 3.445}'
]

let c2 = [
    '{"command": "sell", "price": 100.003, "amount": 2.4}',
    '{"command": "buy", "price": 90.394, "amount": 3.445}',
    '{"command": "buy", "price": 89.394, "amount": 4.3}',
    '{"command": "sell", "price": 100.013, "amount": 2.2}',
    '{"command": "buy", "price": 90.15, "amount": 1.305}',
    '{"command": "buy", "price": 90.394, "amount": 1.0}'        
 ]

 let c3 = [
    '{"command": "sell", "price": 100.003, "amount": 2.4}',
    '{"command": "buy", "price": 90.394, "amount": 3.445}',
    '{"command": "buy", "price": 89.394, "amount": 4.3}',
    '{"command": "sell", "price": 100.013, "amount": 2.2}',
    '{"command": "buy", "price": 90.15, "amount": 1.305}',
    '{"command": "buy", "price": 90.394, "amount": 1.0}',
    '{"command": "sell", "price": 90.394, "amount": 2.2}'  
 ]

 let c4 = [
    '{"command": "sell", "price": 100.003, "amount": 2.4}',
    '{"command": "buy", "price": 90.394, "amount": 3.445}',
    '{"command": "buy", "price": 89.394, "amount": 4.3}',
    '{"command": "sell", "price": 100.013, "amount": 2.2}',
    '{"command": "buy", "price": 90.15, "amount": 1.305}',
    '{"command": "buy", "price": 90.394, "amount": 1.0}',
    '{"command": "sell", "price": 90.394, "amount": 2.2}',
    '{"command": "sell", "price": 90.15, "amount": 3.4}',      
    '{"command": "buy", "price": 91.33, "amount": 1.8}',      
    '{"command": "buy", "price": 100.01, "amount": 4.0}',        
    '{"command": "sell", "price": 100.15, "amount": 3.8}' 
 ]

 var o = new OrderBook("dogecoin")

 batchOrder(c4, o)

 console.log("Buy ===================")
 printT(o.buyTree)
 
 console.log("SELL ===================")
 printT(o.sellTree)

 console.log(o.listOrder())