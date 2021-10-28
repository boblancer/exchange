export class OrderRequest {
    command: string;
    limit: number;
    shares: number;

    constructor(command: string, limit: number, shares: number){
        this.command = command
        this.shares = shares
        this.limit = limit
    }
}
