import { Limit } from "./limit";

// buyOrSell {Buy = True, Sell = False}
export class Order {
    shares: number;
    entryTime: Date;

    constructor(shares: number) {
        this.shares = shares
        this.entryTime = new Date
    }

}