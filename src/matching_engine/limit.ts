export default class Limit {
	private _limitPrice: number;
	private _totalVolume: number;

	constructor(share: number, limit: number){
		this._limitPrice = limit
		this._totalVolume = share
	}

	limitPrice(): number{
		return this._limitPrice
	}

	availableShare(): number{
		return this._totalVolume
	}

	placeShareOrder(share: number){
		this._totalVolume += share
	} 

	removeShare(share: number){
		this._totalVolume -= share
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
