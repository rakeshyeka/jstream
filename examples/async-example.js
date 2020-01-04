/**
 * Run these examples using `npm run examples`
 */
const fetch = require('node-fetch');
const jstream = require('../dist/jstream.bundle');
const streamAsync = jstream.streamAsync;

const fetchTodo = async id => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    const json = await response.json();
    return json;
};

const ids = [1,2,3,4,5,6,7,8];

(async () => {
    const streamer = new streamAsync(ids);
    let todos = await streamer
        .mapAsync(fetchTodo)
        .collect();
    console.log("#### fetch todos for the given ids ####")
    console.log(todos);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let incompleteIds = await streamer
        .filterAsync(async id => {
            const todo = await fetchTodo(id);
            return !todo.completed;
        })
        .collect();
    console.log("#### filter ids with incomplete todos ####")
    console.log(incompleteIds);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let todos = await streamer
        .mapAsync(fetchTodo)
        .filterAsync(todo => !todo.completed)
        .collect();
    console.log("#### filter todos which are incomplete ####")
    console.log(todos);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let todo = await streamer
        .findAsync(async id => {
            const todo = await fetchTodo(id);
            return todo.title.split(" ").length > 4;
        });
    console.log("#### find first id with a todo title greater than 4 words ####")
    console.log(todo);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let todo = await streamer
        .mapAsync(fetchTodo)
        .filterAsync(todo => todo.title.split(" ").length > 4)
        .findFirst();
    console.log("#### find first todo  with title greater than 4 words ####")
    console.log(todo);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let allTodosBelongTo1 = await streamer
        .everyAsync(async id => {
            const todo = await fetchTodo(id);
            return todo.userId == 1;
        });
    console.log("#### check if all todos belong to user 1 ####")
    console.log(allTodosBelongTo1);
    console.log("\n\n");
})();

(async () => {
    const streamer = new streamAsync(ids);
    let allTodosBelongTo1 = await streamer
        .someAsync(async id => {
            const todo = await fetchTodo(id);
            return todo.completed;
        });
    console.log("#### check if some todos are complete ####")
    console.log(allTodosBelongTo1);
    console.log("\n\n");
})();