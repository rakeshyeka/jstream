import {chainRunnerFactory, FILTER, MAP} from './helper';
export default class stream {
    constructor(arr) {
        if (!Array.isArray(arr))
            throw new TypeError("Invalid arguments, argument of type Array required");
        this._arr = arr;
        this._streamChain = [];
    }

    filter(fn) {
        this._streamChain.push({
            run: fn,
            type: FILTER
        });
        return this;
    }

    map(fn) {
        this._streamChain.push({
            run: fn,
            type: MAP
        });

        return this;
    }

    collect = chainRunnerFactory(
        () => true,
        (isChainDone, newItem, fn, newArr) => {
            newArr = newArr 
                ? newArr 
                : fn ? fn : [];
            if (isChainDone) {
                newArr.push(newItem);
            }
            return [newArr, newArr];
        })
    .bind(this);

    reduce = chainRunnerFactory(
        () => true,
        (isChainDone, newItem, fn, aggregator) => {
            if (isChainDone) {
                aggregator = fn(aggregator, newItem);
            }
            return [aggregator, aggregator];
        }
    )
    .bind(this);

    find = chainRunnerFactory(
        (isChainDone, newItem, fn) => {
            let searchNextItem = true;
            if (isChainDone && fn(newItem)) {
                searchNextItem = false;
            }

            return searchNextItem;
        },
        (isChainDone, newItem, fn) => {
            return isChainDone && fn(newItem) ? [newItem] : [];
        }
    )
    .bind(this);

    every(fn) {
        return this.find(item => !fn(item)) === undefined;
    }

    some(fn) {
        return this.find(item => fn(item)) !== undefined;
    }

    findFirst() {
        return this.find(() => true);
    }
};