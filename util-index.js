import lodashData from "raw-loader!./dist/lodash.js";
import DWorker from "./DynamicWorker.ts";

const worker = new DWorker(lodashData);

worker.dispatch('uuid').then(res => {
  console.log('uuid', res)
})

worker.dispatch('pad', 'abc', 10).then(res => {
  console.log('lodash pad 后的结果', res)
})

// worker.dispatch('uuid').then(res => {
//   console.log('uuid', res)
// })