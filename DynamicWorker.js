class DynamicWorker {
  constructor(fn) {
    this.flagMapping = {};
    const handleResult = ({ data: { flag, data } }) => {
      const { resolve, reject } = this.flagMapping[flag];
      if (resolve) {
        resolve(data);
        delete this.flagMapping[flag];
      }
      if (reject) {
        reject(data);
        delete this.flagMapping[flag];
      }
    };
    const onMessageHandlerFn = `
    const __fn = ${fn};
    console.log(__fn);
    self.onmessage = e => {
      const { flag, method, args } = e.data;
      console.log(flag, method, args);
      const data = __fn[method] && __fn[method](...args) || null;
      console.log('data', data);
      self.postMessage({flag, data});
    };
    `;
    const blob = new Blob([onMessageHandlerFn], {
      type: "application/javascript",
    });
    this.worker = new Worker(URL.createObjectURL(blob));

    // this.worker = new Worker(
    //   "data:text/javascript," +
    //     encodeURIComponent(`
    //     'use strict';
    //     const __fn = ${fn};
    //     console.log(__fn);
    //     self.onmessage = e => {
    //       const { flag, method, args } = e.data;
    //       console.log(flag, method, args);
    //       const data = __fn[method] && __fn[method](...args) || null;
    //       self.postMessage({flag, data});
    //     };
    //   `)
    // );
    this.worker.addEventListener("message", handleResult);
    this.worker.addEventListener("error", handleResult);
    URL.revokeObjectURL(blob);
  }
  dispatch(method, ...args) {
    const flag = `${new Date().getTime()}${parseInt(Math.random() * 1000)}`; // uuid
    this.worker.postMessage({
      flag,
      method,
      args,
    });
    return new Promise((resolve, reject) => {
      this.flagMapping[flag] = { resolve, reject };
    });
  }
  close() {
    this.worker.terminate();
  }
}

export default DynamicWorker;
