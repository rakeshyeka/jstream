export const FILTER = 'filter';
export const MAP = 'map';
export const chainRunnerFactory = function(proceedOnFailure, updateAccumulator) {
    return function(ArrOrFn, accumulator) {
        var returnItem = undefined;
        this._arr
            .every(newItem => {
                var isChainDone = this._streamChain
                    .every(action => {
                        var [runNextAction, resp] = executeAction(action, newItem);
                        newItem = resp;
                        
                        return runNextAction;
                    })
                const proceedNextItem = proceedOnFailure(isChainDone, newItem, ArrOrFn, accumulator);
                [returnItem, accumulator] = updateAccumulator(isChainDone, newItem, ArrOrFn, accumulator);
                return proceedNextItem;
            });
        
        return returnItem;
    };
};

export const asyncChainRunnerFactory = function(proceedOnFailure, updateAccumulator) {
    return async function(ArrOrFn, accumulator) {
        let proceedNextItem = true;
        let returnItem = undefined;
        for (let itemIndex=0; proceedNextItem && itemIndex<this._arr.length; itemIndex++) {
            let newItem = this._arr[itemIndex];
            let proceedNextAction = true, resp;
            for (let actionIndex=0; proceedNextAction && actionIndex<this._streamChain.length; actionIndex++) {
                let action = this._streamChain[actionIndex];
                [proceedNextAction, resp] = await asyncExecuteAction(action, newItem);
                newItem = resp;
            }
            proceedNextItem = await proceedOnFailure(proceedNextAction, newItem, ArrOrFn, accumulator);
            [returnItem, accumulator] = await updateAccumulator(proceedNextAction, newItem, ArrOrFn, accumulator);
        }

        return returnItem;
    };
};

export const executeAction = function(action, newItem) {
    var runNextAction = true;
    var resp = action.run(newItem);
    if (action.type === FILTER && !resp) {
        runNextAction = false;
    } else if (action.type === MAP) {
        newItem = resp;
    }

    return [runNextAction, newItem];
}

export const asyncExecuteAction = async function(action, newItem) {
    var runNextAction = true;
    var resp = await action.run(newItem);
    if (action.type === FILTER && !resp) {
        runNextAction = false;
    } else if (action.type === MAP) {
        newItem = resp;
    }

    return [runNextAction, newItem];
}