const hitTypicode = async (id) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
    const json = await response.json();
    return json;
}

let arr = [...Array(5).keys()];
arr = arr.map(item => item+1);
let mappedResponses = arr.map(async item => {
    const json = await hitTypicode(item);
    return json;
});
let reducedResponses = arr.reduce(async (agr, item) => {
    const json = await hitTypicode(item);
    const title = json.title;
    const acc = await agr;
    return acc ? `${acc} :: ${title}` : title;
}, Promise.resolve());

(async () => {
    let mappedResp = arr.map(id => {
        const json = await hitTypicode(id);
        console.log(json);
        return json;
    });

    return mappedResp;
})();