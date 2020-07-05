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
      console.log(flag, method, args, __fn[method]);
      const data = __fn[method] && __fn[method](...args) || null;
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

// 方式1：字符串
const util = `{
  add: function (num) {
    return num + num
  },
  say: function (name) {
    return "我的名字叫" + name
  }
}`;
// 方式2: 函数
// const util = (method, ...args) => {
//   if (method === 'add') {
//     return args[0] + args[1]
//   }
//   if (method === 'say') {
//     return '我的名字叫' + args[0]
//   }
// };

const lee = `parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"YOqM":[function(require,module,exports) {
  "use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var e=function(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,function(e){return(e^crypto.getRandomValues(new Uint8Array(1))[0]&15>>e/4).toString(16)})},t=function(){var e=new Date;return e.setDate(e.getDate()-1),e.toISOString().split("T")[0]},r={UUIDGeneratorBrowser:e,yesterday:t},n=r;exports.default=n;
  },{}]},{},["YOqM"], null)`;

const worker = new DynamicWorker(util);

worker.dispatch("say", "小星星").then((res) => {
  console.log("worker 运行完了", res);
});

worker.dispatch("add", 10).then((res) => {
  console.log("worker 运行完了", res);
});