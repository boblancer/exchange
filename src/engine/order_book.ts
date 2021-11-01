import BTree from 'sorted-btree'
import { OrderRequest } from '../api/model/order_request';
import { Limit } from './limit';

class OrderBook {
    decimalPrecision: number;
    assetName: string;
    buyTree: BTree;
    sellTree: BTree;

    constructor(name: string, sharePrecision: number=1000) {
        this.assetName = name
        this.decimalPrecision = sharePrecision

        this.buyTree = new BTree(undefined, Limit.compareDecreasing)
        this.sellTree = new BTree(undefined, Limit.compareIncreasing)
    }
    
    fillBuyOrder(targetShares: number, limit: number): number {
        let current = 0

        while( current < targetShares ){
            let key = this.sellTree.minKey()
            let lowestLimit = this.sellTree.get(key)
            let availableShare = lowestLimit.availableShare()

            if (lowestLimit.limitPrice() > limit){
                break
            }

            let orderAmount = (
                targetShares - current >= availableShare 
                ? availableShare : targetShares - current
            )

            lowestLimit.removeShare(orderAmount)
            current += orderAmount

            if (orderAmount == availableShare){
                this.sellTree.delete(key)
            }
            
        }
        return targetShares - current;
    }

    fillSellOrder(targetShares: number, limit: number): number {
        let current = 0
        while( current < targetShares ){
            let key = this.buyTree.minKey()
            let nextBestDeal = this.buyTree.get(key)
            let availableShare = nextBestDeal.availableShare()
            
            if (nextBestDeal.limitPrice() < limit){
                break
            }
            let buyAmount = (
                targetShares - current >= availableShare 
                ? availableShare : targetShares - current
            )
            console.log("fillign sell order ", nextBestDeal.limitPrice(), limit, buyAmount)

            nextBestDeal.removeShare(buyAmount)
            current += buyAmount
            
            console.log(buyAmount == availableShare, "buy all deleteing ")
            if (buyAmount == availableShare){
                this.buyTree.delete(key)
            }
            
        }
        return targetShares - current;
    }

    createNewOrder(shares: number, limit: number, tree: BTree) {
        // Create new limit node and assign it to buyTree
        if (!tree.has(limit)){
        
            let new_limit = new Limit(shares, limit)
            
            tree.set(limit, new_limit)
        }
         // Push new Order to limit Node
        else if (tree.has(limit)){
            tree.get(limit).placeShareOrder(shares)
        }
    }

    processBuyOrder(shares: number, limit: number) {
        var unbroughtShare = shares
        var minKey = this.sellTree.minKey()
        if (minKey != undefined &&
            limit >= this.sellTree.get(minKey).limitPrice()){
            unbroughtShare = this.fillBuyOrder(shares, limit)
        }
        if (unbroughtShare > 0){
            this.createNewOrder(unbroughtShare, limit, this.buyTree)
        }
    }

    processSellOrder(shares: number, limit: number) {
        var unsold_share = shares
        var maxKey = this.buyTree.minKey()
        
        if (maxKey != undefined &&
            limit <= this.buyTree.get(maxKey).limitPrice()){
            unsold_share = this.fillSellOrder(shares, limit)
            
        }
        if (unsold_share > 0){
            this.createNewOrder(unsold_share, limit, this.sellTree)
        }
    }

    // Handle sha
    processOrder(order: OrderRequest) {
        let share = Math.trunc(order.amount * this.decimalPrecision)
        let limit = Math.trunc(order.price * this.decimalPrecision)
        // let limit = new number(order.price)
        // let share = new number(order.amount)
        switch(order.command) {
            case "buy":
                this.processBuyOrder(share, limit)
              break;
            case "sell":
                this.processSellOrder(share, limit)
              break;
            default:
                console.log("Invalid command")
          }
    }
}

export default OrderBook