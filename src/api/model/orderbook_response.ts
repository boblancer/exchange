import { ShareLimitTuple } from "./share_limit_tuple";

export class OrderBookResponse {
	buy: ShareLimitTuple[];
	sell: ShareLimitTuple[];
}
