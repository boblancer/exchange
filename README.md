
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
![image](https://user-images.githubusercontent.com/40311101/139872062-cfb835c8-1a33-4240-9649-9afb26e59d24.png)

## Internal API Reference

#### Operation Runtime Complexity current in use

| Operation | Cost     | Used In                |
| :-------- | :------- | :------------------------- |
| Insert        | `O(log M)` | **_createNewOrder()** |
| Delete(Root)  | `O(1)`   | **_fillOrder()** |
| Find(Root)    | `O(1)`   | **_fillOrder()** & **_processOrder()** |

#### Internal data storage
![image](https://user-images.githubusercontent.com/40311101/139876783-af723818-f7d7-4c75-a26e-e76d2b6c3f7d.png)


## References

 - [Internal data-structure design](https://web.archive.org/web/20110219163448/http://howtohft.wordpress.com/2011/02/15/how-to-build-a-fast-limit-order-book/)
 - [Internal API](https://github.com/charles-cooper/itch-order-book)
 - [Design Trade-off](https://quant.stackexchange.com/questions/63140/red-black-trees-for-limit-order-book)


