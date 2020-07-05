onmessage = (e) => {
  console.log("Message received from main script");

  let workerResult = `Result: ${JSON.stringify(e)}`;
  console.log("Posting message back to main script");

  postMessage(workerResult);
};
