import OrderBook from "../../src/matching_engine/order_book";
import {Command} from "../../src/matching_engine/order_book"
import BTree from "sorted-btree";
import Limit from "../../src/matching_engine/limit";
import { OrderRequest } from "../../src/api/model/order_request";
import { OrderBookResponse } from "../../src/api/model/orderbook_response";

var assert = require('assert');
var sinon = require("sinon");


function constructTreeHelper(value: number[][]
	, compareFn: (a: number, b: number) => number): BTree{
	var tree = new BTree(undefined, compareFn)
	value.forEach(x=> {
		tree.set(x[1], new Limit(x[0], x[1]))
	})
	return tree
}

function createOrderFromJson(input: OrderRequest[], o: OrderBook){
	input.forEach(s => {
		o.processCommand(s)
	});
}

describe('OrderBook', function() {
	const controlInt = 9999

	describe('OrderBook local integration(input.json output.json)', function() {
		const input: {[key: string]: any} = require('./input.json');
		const output: {[key: string]: any} = require('./output.json');

		it('input 1 from input.json return correct output.json', function() {
			let book = new OrderBook();
			createOrderFromJson(input[0].orders, book)
			const expected: OrderBookResponse = output[0]

			let result = JSON.stringify(book.listOrder())
			assert.equal(result, JSON.stringify(expected));
		});
		it('input 2 from input.json return correct output.json', function() {
			let book = new OrderBook();
			createOrderFromJson(input[1].orders, book)
			const expected: OrderBookResponse = output[1]

			let result = JSON.stringify(book.listOrder())
			assert.equal(result, JSON.stringify(expected));
		});

		it('input 3 from input.json return correct output.json', function() {
			let book = new OrderBook();
			createOrderFromJson(input[2].orders, book)
			const expected: OrderBookResponse = output[2]

			let result = JSON.stringify(book.listOrder())
			assert.equal(result, JSON.stringify(expected));
		});

		it('input 4 from input.json return correct output.json', function() {
			let book = new OrderBook();
			createOrderFromJson(input[3].orders, book)
			const expected: OrderBookResponse = output[3]

			let result = JSON.stringify(book.listOrder())
			assert.equal(result, JSON.stringify(expected));
		});
	});

	describe('_processOrder() branching logic', function() {
		const fillOrderWithReturnValue = {
			_0: (targetShares: number, limit: number, command: Command) => 0,
			_1000: (targetShares: number, limit: number, command: Command) => 1000,
		};

		const createNewOrder = {
			default: (shares: number, limit: number, tree: BTree) => 0,
		};

		describe('Buy Command', function() {
			it('should not call createNewOrder() when all shares are fulfilled by fillOrder()', function() {
				let book = new OrderBook()

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._0));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
					, sinon.fake(createNewOrder.default));

				var oppositeTree = constructTreeHelper([[controlInt, controlInt]], Limit.compareIncreasing)

				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				book._processOrder(controlInt, controlInt, Command.Buy)

				assert.equal(fakefillOrder.callCount, 1);
				assert.equal(fakeCreateNewOrder.callCount, 0);
			});

			it('should call createNewOrder() when opposite tree is empty', function() {
				let book = new OrderBook()

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._0));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
					, sinon.fake(createNewOrder.default));

				book._processOrder(controlInt, controlInt, Command.Buy)

				assert.equal(fakefillOrder.callCount, 0);
				assert.equal(fakeCreateNewOrder.callCount, 1);
			});

			it('should also call createNewOrder() when fillOrder() cannot fulfill all order', function() {
				let book = new OrderBook()

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._1000));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
					, sinon.fake(createNewOrder.default));

				var oppositeTree = constructTreeHelper([[controlInt, controlInt]], Limit.compareIncreasing)

				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				book._processOrder(controlInt, controlInt, Command.Buy)

				assert.equal(fakefillOrder.callCount, 1);
				assert.equal(fakeCreateNewOrder.callCount, 1);
			});
		});

		describe('Sell Command', function() {
			it('should not call createNewOrder() when all shares are fulfilled by fillOrder()', function() {
				let book = new OrderBook()
				let share = 100;

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._0));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
					, sinon.fake(createNewOrder.default));

				var tree = constructTreeHelper([[controlInt, controlInt]], Limit.compareDecreasing)

				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => tree));

				book._processOrder(share, controlInt, Command.Sell)

				assert.equal(fakefillOrder.callCount, 1);
				assert.equal(fakeCreateNewOrder.callCount, 0);

			});

			it('should call createNewOrder() when opposite tree is empty', function() {
				let book = new OrderBook()

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._0));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
				, sinon.fake(createNewOrder.default));

				book._processOrder(controlInt, controlInt, Command.Sell)

				assert.equal(fakefillOrder.callCount, 0);
				assert.equal(fakeCreateNewOrder.callCount, 1);
			});

			it('should also call createNewOrder() when fillOrder() cannot fulfill all order', function() {
				let book = new OrderBook()

				const fakefillOrder = sinon.replace(book, "_fillOrder"
					, sinon.fake(fillOrderWithReturnValue._1000));

				const fakeCreateNewOrder = sinon.replace(book, "_createNewOrder"
					, sinon.fake(createNewOrder.default));

				var oppositeTree = constructTreeHelper([[controlInt, controlInt]], Limit.compareIncreasing)

				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				book._processOrder(controlInt, controlInt, Command.Sell)

				assert.equal(fakefillOrder.callCount, 1);
				assert.equal(fakeCreateNewOrder.callCount, 1);
			});
		});
	});

	describe('_createNewOrder() correctly populate order tree', function() {
		it('Correctly update existing limit node in the tree', function() {
			let book = new OrderBook()
			let limit = 350
			book.sellTree = constructTreeHelper([[controlInt, 350]], Limit.compareIncreasing)

			book._createNewOrder(controlInt, limit, book.sellTree)
			assert.equal(book.listOrder().sell.length, 1)
		});

		it('Correctly insert new limit node into the tree', function() {
			let book = new OrderBook()
			let limit1 = 350
			let limit2 = 420
			book.sellTree = constructTreeHelper([[controlInt, limit1]], Limit.compareIncreasing)

			book._createNewOrder(controlInt, limit2, book.sellTree)
			assert.equal(book.listOrder().sell.length, 2)
		});
	});

	describe('_fillOrder() correctly match incoming order', function() {
		var limit = 350
		var shares = 1000
		let unfulfillAmount = 50

		describe('Sell Order', function() {
			it('Complete sell order fulfillment returning 0', function() {
				let book = new OrderBook()

				var oppositeTree = constructTreeHelper([[shares, limit]], Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Sell)

				assert.equal(res, 0)
			});

			it('Complete sell order fulfillment with partial match returning 0', function() {
				let book = new OrderBook()

				let tree = [
					[shares/4, limit + 50],
					[shares/4, limit + 40],
					[shares/4, limit + 30],
					[shares/4, limit + 20],
			]
				var oppositeTree = constructTreeHelper(tree, Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Sell)

				assert.equal(res, 0)
			});

			it('Unable to fulfillment entire sell order with partial match returning unfulfill amount', function() {
				let book = new OrderBook()

				let tree = [
					[shares/4, limit + 50],
					[shares/4, limit + 40],
					[shares/4, limit + 30],
					[shares/4 - unfulfillAmount, limit + 20],
			]
				var oppositeTree = constructTreeHelper(tree, Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Sell)

				assert.equal(res, unfulfillAmount)
			});

			it('Unable to fulfillment entire sell order returning unfulfill amount', function() {
				let book = new OrderBook()

				var oppositeTree = constructTreeHelper([[shares - unfulfillAmount, limit]], Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Sell)
				assert.equal(res, unfulfillAmount)
			});
		});

		describe('Buy Order', function() {
			it('Complete buy order fulfillment returning 0', function() {
				let book = new OrderBook()

				var oppositeTree = constructTreeHelper([[shares, limit]], Limit.compareIncreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Buy)
				assert.equal(res, 0)
			});

			it('Complete buy order fulfillment with partial match returning 0', function() {
				let book = new OrderBook()

				let tree = [
					[shares/4, limit - 50],
					[shares/4, limit - 40],
					[shares/4, limit - 30],
					[shares/4, limit - 20],
			]
				var oppositeTree = constructTreeHelper(tree, Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Buy)

				assert.equal(res, 0)
			});

			it('Unable to fulfillment entire buy order with partial match returning unfulfill amount', function() {
				let book = new OrderBook()

				let tree = [
					[shares/4, limit - 50],
					[shares/4, limit - 40],
					[shares/4, limit - 30],
					[shares/4, limit - 20],
			]
				var oppositeTree = constructTreeHelper(tree, Limit.compareDecreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Buy)

				assert.equal(res, 0)
			});

			it('Unable to fulfillment entire buy order returning unfulfill amount', function() {
				let book = new OrderBook()

				var oppositeTree = constructTreeHelper([[shares - unfulfillAmount, limit]], Limit.compareIncreasing)
				sinon.replace(book, "getOppositeTree"
					, sinon.fake(() => oppositeTree));

				let res = book._fillOrder(shares, limit, Command.Buy)
				assert.equal(res, unfulfillAmount)
			});
		});
	});
});