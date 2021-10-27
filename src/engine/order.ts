import { Limit } from "./limit";

// buyOrSell {Buy = True, Sell = False}
export class Order {
    buyOrSell: Boolean;
    shares: number;
    entryTime: Date;

    prev: Order;
    next: Order;

    constructor(buyOrSell: boolean, shares: number) {
        buyOrSell = buyOrSell
        this.shares = shares
    }

}