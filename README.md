# jstream
Implementation of JAVA Streams in javascript

In Java stream, streaming methods like filter and map are short-circuited when chained with methods like findFirst, allMatch [Ref - Java doc](https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html#StreamOps).

This project implements a javascript streaming of arrays with short-circuited implementations of _filter, map, reduce, every, find, some, findFirst_ and _collect_

## Examples:

__filtering an array__
```javascript
import stream from 'stream';
let arr = [1,2,3,4,5,6];
let streamer = new stream(arr);
 
let filteredArr = streamer
    .filter(item => item % 2 == 0)
    .collect();
   
console.log(filteredArr);
```
Output: `[2, 4, 6]`

__short-circuited every__
```javascript
let streamer = new stream(arr);
let count = 0;
let allOdd = streamer
    .filter(item => {
      count++;
      return item % 2 == 0;
    })
    .every(item => item % 2==1);
   
console.log(`Filter ran ${count} times`);
```
Output: `Filter ran 1 times`
