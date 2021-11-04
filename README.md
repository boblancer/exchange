
# Boblancer Exchange Engine

Zipmex code challenge

## Installation

Run with docker

```bash
  docker build -t boblancer-zipmex .
  docker run boblancer-zipmex:latest
```

## Library **(npm)**

 - Mocha, Sinon **(Testing)**
 - sorted-btree **(B+ tree for internal storage)**

## Test Suite
```js
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
```
![image](https://user-images.githubusercontent.com/40311101/139872062-cfb835c8-1a33-4240-9649-9afb26e59d24.png)

## Internal Reference

#### Flowchart
![image](https://user-images.githubusercontent.com/40311101/139891812-3906ae4e-ff9c-421d-8518-90c257084824.png)

#### Operation runtime complexity currently in use

| Operation | Cost     | Used In                |
| :-------- | :------- | :------------------------- |
| Insert        | `O(log n)` | **_createNewOrder()** |
| Delete(Root)  | `O(t log n)`   | **_fillOrder()** |
| Find(Root)    | `O(1)`   | **_fillOrder()** & **_processOrder()** |

#### Internal data storage
![image](https://user-images.githubusercontent.com/40311101/139876783-af723818-f7d7-4c75-a26e-e76d2b6c3f7d.png)


## References

 - [Internal data-structure design](https://web.archive.org/web/20110219163448/http://howtohft.wordpress.com/2011/02/15/how-to-build-a-fast-limit-order-book/)
 - [Internal API](https://github.com/charles-cooper/itch-order-book)
 - [Design Trade-off](https://quant.stackexchange.com/questions/63140/red-black-trees-for-limit-order-book)


