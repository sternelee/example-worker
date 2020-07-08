import sparkMD5 from "raw-loader!./dist/sparkMD5.js";
import DWorker from "./DynamicWorker";

const worker = new DWorker(sparkMD5);

const fileDom = document.getElementById('file');
fileDom.addEventListener("change", function (e) {
  const file = fileDom.files[0];
  worker.dispatch('md5', file)
    .then(res => {
      console.log(res);
    })
});