import streamAsync from '../src/streamAsync';
import {randomInt} from './testData';
let arr = [...Array(randomInt(6, 15)).keys()];
arr = arr.map(item => item+1);

let streamer;
beforeEach(() => {
    streamer = new streamAsync(arr);
});

describe('sanity: streamAsync', () => {
    it('should throw when not array', () => {
        let t = () => {
            streamAsync(1);
        }
        expect(t).toThrow(TypeError);
    });

    it('should filter array', async () => {
        let filterPromiseCondition = item => new Promise(resolve => resolve(item%2));
        let filteredArr = await streamer
            .filterAsync(filterPromiseCondition)
            .collect();
        expect(filteredArr).toEqual(arr.filter(item => item%2));
    });
    it('should map array', async () => {
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let mappedArr = await streamer
            .mapAsync(mapperPromise)
            .collect();
        expect(mappedArr).toEqual(arr.map(item => item*2));
    });
    it('should chain actions of array', async () => {
        let filterPromiseCondition = item => new Promise(resolve => resolve(item%2));
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let mappedArr = await streamer
            .filterAsync(filterPromiseCondition)
            .mapAsync(mapperPromise)
            .collect([]);
        expect(mappedArr).toEqual(arr.filter(item=>item%2).map(item => item*2));
    });

    it('should find in array', async () => {
        let filterPromiseCondition = item => new Promise(resolve => resolve(item%5 === 0));
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let first = await streamer
            .mapAsync(mapperPromise)
            .findAsync(filterPromiseCondition);
        expect(first).toEqual(arr.map(item => item*2).find(item => item%5 === 0));
    });

    it('should return undefined if not found in array', async () => {
        let filterPromiseCondition = item => new Promise(resolve => resolve(item < 0));
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let first = await streamer
            .mapAsync(mapperPromise)
            .findAsync(filterPromiseCondition);
        expect(first).toEqual(undefined);
    });

    it('should check every in array', async () => {
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let everyPromiseCondition = item => new Promise(resolve => resolve(item%2 === 0));
        let isEvery = await streamer
            .mapAsync(mapperPromise)
            .everyAsync(everyPromiseCondition);
        expect(isEvery).toBeTruthy();
    });

    it('should return false if every not in array', async () => {
        let mapperPromise = item => new Promise(resolve => resolve(item*2));
        let everyPromiseCondition = item => new Promise(resolve => resolve(item%2 !== 0));
        let isEvery = await streamer
            .mapAsync(mapperPromise)
            .everyAsync(everyPromiseCondition);
        expect(isEvery).toBeFalsy();
    });

    it('should reduce array', async () => {
        let filterCondition = item => new Promise(resolve => resolve(item%2));
        let reducer = (agr, item) => new Promise(resolve => resolve(agr + item));
        let init = 0;
        let reduced = await streamer
            .filterAsync(filterCondition)
            .reduceAsync(reducer, init);
        expect(reduced).toEqual(arr.filter(item => item%2).reduce((agr, item) => agr + item, init));
    });

    it('should check some in array', async () => {
        let checkPromiseCondition = item => new Promise(resolve => resolve(item%5 === 0));
        let isFound = await streamer
            .someAsync(checkPromiseCondition);
        expect(isFound).toBeTruthy();
    });

    it('should return first in an array', async () => {
        let mapper = item => new Promise(resolve => resolve({num : item+1, isEven: (item+1)%2 == 0, isOdd: (item+1)%2 == 1}));
        let filterCondition = item => (item+1)%5 == 0;
        let first = await streamer
            .filterAsync(filterCondition)
            .mapAsync(mapper)
            .findFirst();
        expect(first).toEqual({num: 5, isEven: false, isOdd: true});
    });
})