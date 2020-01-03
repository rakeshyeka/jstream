import { asyncChainRunnerFactory, FILTER, MAP } from "./helper";

export default class streamAsync {
    constructor(arr) {
        if (!Array.isArray(arr))
            throw new TypeError("Invalid arguments, argument of type Array required");
        this._arr = arr;
        this._streamChain = [];
    }

    filterAsync = (fn) => {
        this._streamChain.push({
            run: fn,
            type: FILTER
        });
        return this;
    }

    mapAsync = (fn) => {
        this._streamChain.push({
            run: fn,
            type: MAP
        });
        return this;
    }

    collect = asyncChainRunnerFactory(
        async () => true,
        async (proceedNextAction, newItem, fn, newArr) => {
            newArr = newArr 
                ? newArr 
                : fn ? fn : [];
            if (proceedNextAction) {
                newArr.push(newItem);
            }
            return [newArr, newArr];
        })
    .bind(this);

    findAsync = asyncChainRunnerFactory(
        async (proceedNextAction, newItem, fn) => {
            let searchNextItem = true;
            if (proceedNextAction && await fn(newItem)) {
                searchNextItem = false;
            }

            return searchNextItem;
        },
        async (proceedNextAction, newItem, fn) => {
            return proceedNextAction && await fn(newItem) ? [newItem] : [];
        })
    .bind(this);

    reduceAsync = asyncChainRunnerFactory(
        async () => true,
        async (proceedNextAction, newItem, fn, accumulator) => {
            if (proceedNextAction) {
                accumulator = await fn(accumulator, newItem);
            }
            return [accumulator, accumulator];
        }
    )
    .bind(this);

    async everyAsync(fn) {
        const itemNotMatching = await this.findAsync(async item => {
            return !(await fn(item));
        });

        return itemNotMatching === undefined;
    }

    async someAsync(fn) {
        const itemNotMatching = await this.findAsync(async item => {
            return !(await fn(item));
        });

        return itemNotMatching !== undefined;
    }

    async findFirst() {
        return await this.findAsync(async () => true);
    }
    
};