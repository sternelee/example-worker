class DynamicWorker {
  constructor(funcStr) {
    const onMessageHandlerFn = funcStr || `
    self.onmessage = ({ data: { data, flag } }) => {
      console.log('Message received from main script', data);
      const { method } = data
      if (data && method === 'format') {
        self.postMessage({
          data: data.data,
          flag
        });
      } else if (data && method === 'add') {
        self.postMessage({
          data: data.data + data.data,
          flag
        })
      }
      console.log('Posting message back to main script');
    };`;
    const handleResult = ({ data: { data, flag } }) => {
      const resolve = this.flagMapping[flag];
      if (resolve) {
        resolve(data);
        delete this.flagMapping[flag];
      }
    }
    const blob = new Blob([onMessageHandlerFn], {type: 'application/javascript'});
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener('message', handleResult);
    this.flagMapping = {};
    URL.revokeObjectURL(blob);
  }
  send(data) {
    const flag = new Date().toString() + parseInt(Math.random() * 100); // uuid
    this.worker.postMessage({
      data,
      flag,
    });
    return new Promise((res) => {
      this.flagMapping[flag] = res;
    })
  }
  close() {
    this.worker.terminate();
  }
}


const worker = new DynamicWorker()
worker.send({
  data: '哈哈',
  method: 'format'
}).then(res => {
  console.log('res', res)
})

worker.send({
  data: '哈哈2222',
  method: 'add'
}).then(res => {
  console.log('res', res)
})

setTimeout(() => {
  worker.send({
    data: '很好啊啊啊',
    method: 'format'
  }).then(res => {
    console.log('res', res)
  })
}, 3000)

// const worker1 = new DynamicWorker(`self.service = {
//   double: value => value * 2
// };`)

