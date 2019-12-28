let stream=require('./dist/stream.bundle').default;

Array.prototype.stream = function() {return new stream(this)};
let arr = [1,2,3,4,5];
let filteredArr = arr
    .stream()
    .filter(item => item%2)
    .collect();
console.log(filteredArr);