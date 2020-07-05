// const debug = {hello: "world"};
// const blob = new Blob(
//   [JSON.stringify(debug, null, 2)],
//   {type: 'application/json'}
// );

// const worker = new Worker(URL.createObjectURL(blob));

// const response = "onmessage=function(e){postMessage('Worker: '+e.data);}";
// const worker = new Worker(
//   "data:application/javascript," + encodeURIComponent(response)
// );

// worker.onmessage = (e) => {
//   console.log("Response: " + e.data);
// };

// worker.postMessage("Test");


const response = "onmessage=function(e){postMessage('Worker: '+e.data);}";
const blob = new Blob(
  [response],
  {type: "application/javascript"}
);
const worker = new Worker(URL.createObjectURL(blob));
worker.onmessage = (e) => {
  console.log("Response: " + e.data);
};

worker.postMessage("Test");

