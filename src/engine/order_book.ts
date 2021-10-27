import BTree from 'sorted-btree'
import { OrderRequest } from '../api/model/order_request';
import { Limit } from './limit';
import { Order } from './order';

class OrderBook {
    decimalPrecision: number;
    assetName: string;
    buyTree: BTree;
    sellTree: BTree;

    constructor(name: string, share_precision: number=10^6) {
        this.assetName = name
        this.decimalPrecision = share_precision

        this.buyTree = new BTree(undefined, Limit.compareIncreasing)
        this.sellTree = new BTree(undefined, Limit.compareDecreasing)
    }
    
    fillOrder(shares: number, limit: number): number {
        let targetShare = shares
        let currentlyOwn = 0
        let leftoverQuota = 0

        while( this.sellTree[limit] != undefined 
            && currentlyOwn < targetShare ){
            let lowest_sell_limit = this.sellTree[this.sellTree.minKey()]
            let available_share = lowest_sell_limit.availableShare()
            
            if (lowest_sell_limit.limitPrice <= limit){
                let buy_amount = (
                    targetShare >= available_share 
                    ? available_share : targetShare
                )
                lowest_sell_limit.buy(buy_amount)
                currentlyOwn += buy_amount
                leftoverQuota += limit - lowest_sell_limit.limitPrice() * targetShare
            }
            else if (lowest_sell_limit.limitPrice > limit
                && leftoverQuota > 0){
                let buy_amount = (
                    targetShare >= available_share 
                    ? available_share : targetShare
                )
            }
        }
        return 0;
    }

    createNewBuyOrder(shares: number, limit: number) {
        // Create new limit node and assign it to buyTree
        if (this.buyTree[limit] == undefined){
            let order = new Order (true, shares)
            let new_limit = new Limit(order, limit)
            this.buyTree[limit] = new_limit
        }
         // Push new Order to limit Node
        else if (this.buyTree[limit] != undefined){
            this.buyTree[limit].push_last(
                new Order(true, shares)
            )
        }
    }

    processBuyOrder(shares: number, limit: number) {
        var unbrought_share = shares
        var min_key = this.sellTree.minKey()
        if (min_key != undefined){
            if (limit > this.sellTree[min_key].limitPrice){
                let leftover_unbrought = this.fillOrder(shares, limit)
                
            }
        }
        this.createNewBuyOrder(unbrought_share, limit)
    }

    private process_sell_order(shares: number, limit: number) {
    }

    // Handle sha
    processOrder(order: OrderRequest) {
        let share = Math.trunc(order.shares * this.decimalPrecision)
        switch(order.command) {
            case "buy":
                this.processBuyOrder(share, order.limit)
              break;
            case "sell":
                this.process_sell_order(share, order.limit)
              break;
            default:
                console.log("Invalid command")
          }
    }
}

export default OrderBook