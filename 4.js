import DynamicWorker from "./DynamicWorker";

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


const worker = new DynamicWorker(util);

worker.dispatch("say", "小星星").then((res) => {
  console.log("worker 运行完了", res);
});

worker.dispatch("add", 10).then((res) => {
  console.log("worker 运行完了", res);
});


const globalFunc = `
const add = (num) => num * 5;
const say = (name) => '我的名字叫' + name;
`

const worker1 = new DynamicWorker(globalFunc, true);

worker1.dispatch("say", "哈哈")
  .then(res => {
    console.log(res)
  })

worker1.dispatch("add", 100)
  .then(res => {
    console.log(res)
  })