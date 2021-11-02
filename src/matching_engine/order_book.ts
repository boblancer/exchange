import BTree from 'sorted-btree'
import { OrderRequest } from '../api/model/order_request';
import Limit from './limit';

enum Command {
    Buy,
    Sell,
}

class OrderBook {
    decimalPrecision: number;
    assetName: string;
    buyTree: BTree;
    sellTree: BTree;


    constructor(name: string="Asset", sharePrecision: number=10**3) {
        this.assetName = name
        this.decimalPrecision = sharePrecision

        this.buyTree = new BTree(undefined, Limit.compareDecreasing)
        this.sellTree = new BTree(undefined, Limit.compareIncreasing)
    }

    private getOppositeTree(command: Command): BTree{
        switch(command) {
            case Command.Buy:
              return this.sellTree
            case Command.Sell:
              return this.buyTree
          }
    }
    private getTree(command: Command): BTree{
        switch(command) {
            case Command.Buy:
              return this.buyTree
            case Command.Sell:
              return this.sellTree
          }
    }

    private matchExitCondition(nextMatch: number, limit: number, command: Command){
        switch(command) {
            case Command.Buy:
              return nextMatch > limit
            case Command.Sell:
              return nextMatch < limit
          }
    }

    fillOrder(targetShares: number, limit: number, command: Command): number {
        let current = 0
        let targetTree = this.getOppositeTree(command)

        while( current < targetShares ){
            let key = targetTree.minKey()
            let nextMatch = targetTree.get(key)
            let availableShare = nextMatch.availableShare()

            if (this.matchExitCondition(
                nextMatch.limitPrice(), limit, command
                )){
                break
            }

            let orderAmount = (
                targetShares - current >= availableShare 
                ? availableShare : targetShares - current
            )

            nextMatch.removeShare(orderAmount)
            current += orderAmount

            if (orderAmount == availableShare){
                targetTree.delete(key)
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

    processOrder(shares: number, limit: number, command: Command) {
        var targetShares = shares
        var oppositeTree = this.getOppositeTree(command)
        var rootKey = oppositeTree.minKey()
        
        if (rootKey != undefined &&
            limit <= oppositeTree.get(rootKey).limitPrice()){
            targetShares = this.fillOrder(shares, limit, command)
        }
        if (targetShares > 0){
            this.createNewOrder(targetShares, limit, this.getTree(command))
        }
    }

    processInputCommand(order: OrderRequest) {
        let share = Math.trunc(order.amount * this.decimalPrecision)
        let limit = Math.trunc(order.price * this.decimalPrecision)
        switch(order.command) {
            case "buy":
                this.processOrder(share, limit, Command.Buy)
              break;
            case "sell":
                this.processOrder(share, limit, Command.Sell)
              break;
            default:
                console.log("Invalid command")
          }
    }
}

export default OrderBook