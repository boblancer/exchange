import BTree from 'sorted-btree'
import { OrderRequest } from '../api/model/order_request';
import { Limit } from './limit';
import { Order } from './order';

class OrderBook {
    decimalPrecision: number;
    assetName: string;
    buyTree: BTree;
    sellTree: BTree;

    constructor(name: string, sharePrecision: number=1) {
        this.assetName = name
        this.decimalPrecision = sharePrecision

        this.buyTree = new BTree(undefined, Limit.compareDecreasing)
        this.sellTree = new BTree(undefined, Limit.compareIncreasing)
    }
    
    fillOrder(targetShares: number, limit: number): number {
        console.log("filling order")
        console.log("=====================================")
        console.log(this.sellTree)
        console.log("=====================================")

        let currentlyOwn = 0
        let residue = 0


        while( currentlyOwn < targetShares ){
            let lowestLimit = this.sellTree.get(this.sellTree.minKey())
            let availableShare = lowestLimit.availableShare()
            
            if (lowestLimit.limitPrice() <= limit){
                let buyAmount = (
                    targetShares - currentlyOwn >= availableShare 
                    ? availableShare : targetShares - currentlyOwn
                )

                lowestLimit.buy(buyAmount)
                currentlyOwn += buyAmount

                residue += (limit - lowestLimit.limitPrice()) * buyAmount
                console.log("Buying low", buyAmount, "own ", currentlyOwn, residue, "lowest", lowestLimit.limitPrice())
            }
            else if (lowestLimit.limitPrice() > limit
                && residue > 0){
                let priceDifference = lowestLimit.limitPrice - limit
                let buyAmountFromResidue = priceDifference / residue
                let buyAmount = (
                    buyAmountFromResidue >= availableShare 
                    ? availableShare : buyAmountFromResidue
                )

                lowestLimit.buy(buyAmount)
                currentlyOwn += buyAmount
                residue -= priceDifference * buyAmount
                console.log("Buying extra", buyAmount, "own ", currentlyOwn, residue)
            }
        }
        return targetShares - currentlyOwn;
    }

    createNewOrder(shares: number, limit: number, tree: BTree) {
        // Create new limit node and assign it to buyTree
        let limitStr = String(limit)

        if (!tree.has(limitStr)){
            let order = new Order (shares)
            let new_limit = new Limit(order, limit)
            
            tree.set(limitStr, new_limit)
        }
         // Push new Order to limit Node
        else if (tree.has(limitStr)){
            tree.get(limitStr).pushLast(
                new Order(shares)
            )
        }
    }

    processBuyOrder(shares: number, limit: number) {
        var unbrought_share = shares
        var minKey = this.sellTree.minKey()
        if (minKey != undefined){
            if (limit >= this.sellTree.get(minKey).limitPrice()){
                let leftover_unbrought = this.fillOrder(shares, limit)
                
            }
        }
        this.createNewOrder(unbrought_share, limit, this.buyTree)
    }

    processSellOrder(shares: number, limit: number) {
        var unsold_share = shares
        var maxKey = this.buyTree.maxKey()
        // if (maxKey != undefined){
        //     if (limit > this.sellTree.get(maxKey).limitPrice){
        //         let leftover_unbrought = this.fillOrder(shares, limit)
                
        //     }
        // }
        this.createNewOrder(unsold_share, limit, this.sellTree)
    }

    // Handle sha
    processOrder(order: OrderRequest) {
        // let share = Math.trunc(order.shares * this.decimalPrecision)
        // let limit = Math.trunc(order.limit * this.decimalPrecision)
        let share = order.shares
        let limit = order.limit
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