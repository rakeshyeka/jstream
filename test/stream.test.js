import stream from '../dist/stream.bundle';
import {randomInt} from './testData';

const arr = [...Array(randomInt(10)).keys()];

let streamer;
beforeEach(() => {
    streamer = new stream(arr);
});
console.log(stream);
describe('sanity: stream', () => {
    it('should filter array', () => {
        let filterCondition = item => item%2;
        let filteredArr = streamer
            .filter(filterCondition)
            .collect();
        expect(filteredArr).toEqual(arr.filter(filterCondition));
    });

    it('should map array', () => {
        let mapper = item => item*2;
        let mappedArr = streamer
            .map(mapper)
            .collect();
        expect(mappedArr).toEqual(arr.map(mapper));
    });

    it('should find in array', () => {
        let filterCondition = item => item%2;
        let first = streamer
            .find(filterCondition);
        expect(first).toEqual(arr.find(filterCondition));
    });

    it('should check every in array', () => {
        let filterCondition = item => item%2;
        let everyCondition = item => (item-1)%2 == 0;
        let isEvery = streamer
            .filter(filterCondition)
            .every(everyCondition);
        expect(isEvery).toBeTruthy();
    });

    it('should reduce array', () => {
        let filterCondition = item => item%2;
        let reducer = (agr, item) => agr + item;
        let init = 0;
        let reduced = streamer
            .filter(filterCondition)
            .reduce(reducer, init);
        expect(reduced).toEqual(arr.filter(filterCondition).reduce(reducer, init));
    });

    it('should check some in an array', () => {
        let filterCondition = item => item%5 == 0;
        let isSomeMatch = streamer
            .some(filterCondition);
        expect(isSomeMatch).toBeTruthy();
    });

    it('should return first in an array', () => {
        let mapper = item => {return {num : item+1, isEven: (item+1)%2 == 0, isOdd: (item+1)%2 == 1}};
        let filterCondition = item => (item+1)%5 == 0;
        let first = streamer
            .filter(filterCondition)
            .map(mapper)
            .findFirst();
        expect(first).toEqual({num: 5, isEven: false, isOdd: true});
    });
});

describe("perf: stream", () => {
    it('should optimize map with every', () => {
        let count = 0;
        let every = streamer
            .map(item => {
                count++;
                return item*2;
            })
            .every(item => item%2 == 1);
        expect(every).toBeFalsy();
        expect(count).not.toEqual(arr.length);
        expect(count).toEqual(1);
    });
    it('should optimize filter with every', () => {
        let count = 0;
        let every = streamer
            .filter(item => {
                count++;
                return item%2==0;
            })
            .every(item => item%2 == 1);
        expect(every).toBeFalsy();
        expect(count).not.toEqual(arr.length);
        expect(count).toEqual(1);
    });
});