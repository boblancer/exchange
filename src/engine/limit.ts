import { Order } from "./order";

export class Limit {
    private _limitPrice: number;
    private _totalVolume: number;

    orders: Order[];

    constructor(order: Order, limit: number){
        this._limitPrice = limit
        this._totalVolume = order.shares

        this.orders = [order];
    }

    pushLast(order: Order){
        this.orders.push(order)
        this._totalVolume += order.shares
    } 

    pushFront(order: Order){
        this.orders.unshift(order)
        this._totalVolume += order.shares
    }

    popFront(){
        this._totalVolume -= this.orders[0].shares
        this.orders.shift();
    }

    availableShare(): number{
        return this._totalVolume;;
    }

    limitPrice(): number{
        return this._limitPrice;;
    }

    buy(share: number){
        this.orders = []
        // + Additional buy logic
    }

    static compareIncreasing(a: number, b: number): number {
        if (a > b)
            return 1; 
        else if (a < b)
            return -1;

        return 0
    }

    static compareDecreasing(a: number, b: number): number {
        if (a > b)
            return -1; 
        else if (a < b)
            return 1;

        return 0
    }
    
}
