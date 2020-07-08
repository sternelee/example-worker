interface IFlagMap {
  [uuid: string]: {
    resolve: Function
    reject: Function
  }
}

type IWorker = null | Worker

class DynamicWorker {
  flagMapping: IFlagMap
  worker: IWorker
  constructor(fn: string) {
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
    ${fn};
    self.onmessage = e => {
      const { flag, method, args } = e.data;
      console.log(flag, method, args);
      const data = method && modules && modules.default[method] && modules.default[method](...args) || null;
      self.postMessage({flag, data});
    };
    `;
    const blob = new Blob([onMessageHandlerFn], {
      type: "application/javascript",
    });
    this.worker = new Worker(URL.createObjectURL(blob));
    this.worker.addEventListener("message", handleResult);
    // this.worker.addEventListener("error", handleResult);
    // URL.revokeObjectURL(blob);
    // URL.revokeObjectURL(<string><unknown>blob);
    URL.revokeObjectURL(blob as unknown as string)
  }
  dispatch(method, ...args) {
    const flag = `${new Date().getTime()}${Math.round(Math.random() * 1000)}`; // uuid
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
