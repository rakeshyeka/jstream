import stream from './dist/stream.bundle';

Array.prototype.stream = () => {new stream(this)};
let arr = [1,2,3,4,5];
let filteredArr = arr
    .stream()
    .filter(item => item%2)
    .collect();
console.log(filteredArr);