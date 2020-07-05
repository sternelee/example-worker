const response = `onmessage = ({ data }) => {
      console.log('Message received from main script', data);
      const {method} = data;
      if (data.data && method === 'format') {
        postMessage({
          data: {
            'res': 'I am a customized result string.',
          }
        });
      }
      console.log('Posting message back to main script');
    }`;
const blob = new Blob([response], { type: "application/javascript" });

const worker = new Worker(URL.createObjectURL(blob));

// 事件处理
worker.onmessage = (e) => {
  console.log("worker", e);
  console.log(`Response: ${JSON.stringify(e.data)}`);
};
worker.postMessage({
  method: "format",
  data: [],
});
