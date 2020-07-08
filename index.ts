import DWorker from "./DynamicWorker";
import * as fs from "fs";

const lodashData = fs.readFileSync('./dist/lodash.js', 'utf-8');
console.log(lodashData)

const worker = new DWorker(lodashData);

worker.dispatch('uuid').then(res => {
  console.log('uuid', res)
})

worker.dispatch('toArray', 'abcd').then(res => {
  console.log('lodash toArray 后的结果', res)
})
