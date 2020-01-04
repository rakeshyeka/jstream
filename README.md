# jstream
- [jstream](#jstream)
  - [Installation:](#installation)
  - [Usage:](#usage)
  - [Examples:](#examples)
  - [API:](#api)
    - [stream](#stream)
      - [collect](#collect)
      - [filter](#filter)
      - [map](#map)
      - [find](#find)
      - [reduce](#reduce)
      - [every](#every)
      - [some](#some)
      - [findFirst](#findfirst)
    - [streamAsync](#streamasync)
      - [collect](#collect-1)
      - [filterASync](#filterasync)
      - [mapAsync](#mapasync)
      - [findAsync](#findasync)
      - [reduceAsync](#reduceasync)
      - [everyAsync](#everyasync)
      - [someAsync](#someasync)
      - [findFirst](#findfirst-1)
  - [Authors](#authors)
  - [Acknowledgements](#acknowledgements)
___
This project implements a javascript *stream* for array similar to Java, with short-circuited implementations of _filter, map, reduce, every, find, some, findFirst_ and _collect_

In Java, streaming methods like filter and map are short-circuited when chained with methods like findFirst, allMatch ([JavaDoc](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html#StreamOps)). This provides efficient and optimised runs, by running each item through chained actions, instead of running each chain action through all items.

Consider the examples below -

__java__

```java
ArrayList<int> arr = Arrays.asList(1,2,3,4,5,6);
arr
   .stream()
   .map(item -> {
	System.out.println("Processing : " + item);
	return 2*item;
   })
   .findFirst();
```

Output: 
`Processing : 1`

__javascript__
  ```javascript
  let arr = [1,2,3,4,5,6];
  arr
     .map(item => {
	     console.log('Processing : ',item);
	     return 2*item;
     })
     .find(item => true);
  ```
Output: 
```
Processing : 1
Processing : 2
Processing : 3
Processing : 4
Processing : 5
Processing : 6
```
Notice that in javascript, *map* runs through all the elements before terminating during the first iteration of *find*, where as in the java code *findFirst* is short-circuited to ensure only one iteration is done.
## Installation:
__Prerequisites__
npm - v6.13.4

__Clone__
`git clone https://github.com/rakeshyeka/jstream.git`

__build__
In the repository folder run:
`npm install && npm run bundle`

__tests__
`npm run test`

## Usage:

```javascript
import {stream} from '<path>/dist/jstream.bundle.js';

let  arr = [1,2,3,4,5,6];
let  streamer = new stream(arr);
let  filterMappedArr = streamer
  .filter(item  =>  item%2 == 0)
  .map(item => item*3)
  .collect();

console.log(filterMappedArr);
```

Output: 
`[6, 12, 18]`

## Examples:
Refer to [examples](examples/) folder  in the source code for examples on how to use *streamAsync*.
These examples can be executed using
`npm run examples`

*Note*: streamAsync examples use [typicode](https://jsonplaceholder.typicode.com/) placeholder APIs, which requires online connectivity for generating expected results.

## API:
jstream.bundle.js exports '*stream*' class as a default export which consumes an array as in its constructor.

### stream
#### collect
This collects the result of the stream after application of all the actions into a new array. Consumes an array as an optional argument and appends the result into the provided array. Collect is intended to be used to consolidate the result of the chained actions. However, when used without any action wraps the elements of existing array into a new array.
```javascript
let arr = [1,2,3,4,5,6];
let streamer = new stream(arr);
let collectedArr = streamer.collect(); // [1, 2, 3, 4, 5, 6]
```
*Note: Do not use collect to clone an array as it does not deep copy elements, just wraps the result in a new array.*

#### filter
`.filter(fn)` filters the result on the provided condition. Returns the instance of stream for further chaining.
```javascript
let filteredArr = streamer // [2, 4, 6]
  .filter(item => item%2 === 0)
  .collect();
```
#### map
`.map(fn)` maps the result on the provided mapper. Returns the instance of stream for further chaining.
```javascript
let mappedArr = streamer // [3, 6, 9, 12, 15, 18]
  .map(item => item*3)
  .collect();
```
#### find
`.find(fn)` searches the result based on the provided condition. Returns the first matching result.
```javascript
let firstResult = streamer // 2
  .find(item => item%2 === 0);
```
#### reduce
`.reduce(fn)` reduces the array based on the provided predicate and initial value. Returns the reduced result.
```javascript
let concatArray = streamer // ' 1 2 3 4 5 6'
  .reduce((accumulator, item) => accumulator + " " + item, "");
```
#### every
`.every(fn)` checks the result whether every item obeys the provided condition. Returns a boolean, false if any one item does not match, true if all items match.
```javascript
let everyMatch = streamer // false
  .filter(item => item%2 === 0)
  .every(item => item%3 !== 0);
```
#### some
`.some(fn)` checks the result whether any item obeys the provided condition. Returns a boolean, false if none match, true if atleast one item matches.
```javascript
let everyMatch = streamer // true
  .filter(item => item%2 === 0)
  .some(item => item%3 !== 0);
```
#### findFirst
`.findFirst()` returns the first item from the result of the existing chain of actions.
```javascript
let firstResult = streamer // 5
  .filter(item => item%2 === 1)
  .map(item => item*5)
  .findFirst();
```

### streamAsync
streamAsync provides the capability to pass asynchronous functions (returning promises) to the streamer to handle actions asynchronous actions.
#### collect
This returns a promise and collects the result of the stream after application of all the actions into a new array, returns it when promise is resolved. Consumes an array as an optional argument and appends the result into the provided array. Collect is intended to be used to consolidate the result of the chained actions. However, when used without any action wraps the elements of existing array into a new array.
```javascript
let arr = [1,2,3,4,5,6];
let streamer = new streamAsync(arr);
(async () => {
  let collectedArr = await streamer.collect(); // [1, 2, 3, 4, 5, 6]
})();
```
*Note: Do not use collect to clone an array as it does not deep copy elements, just wraps the result in a new array.*

#### filterASync
`.filterAsync(fn)` filters the result on the provided condition. Returns the instance of stream for further chaining.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let pendingTodos = await streamer
    .filterAsync(async id => {
      let todo = await fetchTodo(id);
      return !todo.completed
    })
    .collect();
})();
```
#### mapAsync
`.mapAsync(fn)` maps the result on the provided mapper. Returns the instance of stream for further chaining.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let allTodos = await streamer
    .mapAsync(async id => {
      return await fetchTodo(id);
    })
    .collect();
})();
```
#### findAsync
`.findAsync(fn)` searches the result based on the provided condition. Returns the promise for the first matching result.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let firstBill = await streamer
    .findAsync(async id => {
      let todo = await fetchTodo(id);
      return todo.category === "bill";
    });
})();
```
#### reduceAsync
`.reduceASync(fn)` reduces the array based on the provided predicate and initial value. Returns the promise for the reduced result.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let allTodoTitles = await streamer // concatenates all titles into a comma separated string. 
    .reduceAsync(async (titles, id) => {
      let todo = await fetchTodo(id);
      return titles + ', ' + todo.title; // This actually adds a preceding ', ' for the string intentionally
    }, "");
})();
```
#### everyAsync
`.everyAsync(fn)` checks the result whether every item obeys the provided condition. Returns the promise for a boolean, false if any one item does not match, true if all items match.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let allTodosCompleted = await streamer // check if all todos are completed.
    .everyAsync(async id => {
      let todo = await fetchTodo(id);
      return todo.completed;
    });
})();
```
#### someAsync
`.someAsync(fn)` checks the result whether any item obeys the provided condition. Returns the promise for a boolean, false if none match, true if atleast one item matches.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let hasIncompleteTodo = await streamer // check if any todo is not completed
    .someAsync(async id => {
      let todo = await fetchTodo(id);
      return !todo.completed;
    });
})();
```
#### findFirst
`.findFirst()` returns the promise for the first item from the result of the existing chain of actions.
```javascript
const fetchTodo = async id => {
    const response = await fetch(`http:/<myTodosUrl>/todos/${id}`);
    const json = await response.json();
    return json;
};
(async () => {
  let firstBill = await streamer
    .mapAsync(async id => {
      return await fetchTodo(id);
    })
    .filter(todo => todo.category === "bill")
    .findFirst();
})();
```
## Authors
- Jayendra Rakesh Yeka

## Acknowledgements
This project utilises live [typicode](https://jsonplaceholder.typicode.com/) placeholder APIs, for the demonstrating the functionality of this project. These APIs eased the process of development as well and I am very thankful for them.