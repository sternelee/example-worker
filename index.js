import lodashData from "raw-loader!./dist/lodash.js";
import DWorker from "./DynamicWorker";

const worker = new DWorker(lodashData);

worker.dispatch('uuid').then(res => {
  console.log('uuid', res)
})

worker.dispatch('toArray', 'abcd').then(res => {
  console.log('lodash toArray 后的结果', res)
})
