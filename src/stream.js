const FILTER = 'filter';
const MAP = 'map';
export default class stream {
    constructor(arr) {
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

    executeAction(action, newItem) {
        var runNextAction = true;
        var resp = action.run(newItem);
        if (action.type === FILTER && !resp) {
            runNextAction = false;
        } else if (action.type === MAP) {
            newItem = resp;
        }

        return [runNextAction, newItem];
    }

    collect(newArr = []) {
        this._arr
            .forEach(newItem => {
                var isChainDone = this._streamChain
                    .every(action => {
                        var [runNextAction, resp] = this.executeAction(action, newItem);
                        newItem = resp;
                        
                        return runNextAction;
                    });

                if (isChainDone) {
                    newArr.push(newItem);
                }
            });
        return newArr;
    }

    reduce(fn, init) {
        var aggregator = init;
        this._arr
            .forEach(newItem => {
                var isChainDone = this._streamChain
                    .every(action => {
                        var [runNextAction, resp] = this.executeAction(action, newItem);
                        newItem = resp;
                        
                        return runNextAction;
                    });

                if (isChainDone) {
                    aggregator = fn(aggregator, newItem);
                }
            });

        return aggregator;
    }

    find(fn) {
        var returnItem = undefined;
        this._arr
            .every(newItem => {
                var searchNextItem = true;
                var isChainDone = this._streamChain
                    .every(action => {
                        var [runNextAction, resp] = this.executeAction(action, newItem);
                        newItem = resp;
                        
                        return runNextAction;
                    })
                
                if (isChainDone && fn(newItem)) {
                    returnItem = newItem;
                    searchNextItem = false;
                }

                return searchNextItem;
            });
        
        return returnItem;
    }

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