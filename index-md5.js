import Worker from "./sparkMD5.woker";

const worker = new Worker();

worker.addEventListener('message', e => {
  console.log(e)
})

const fileDom = document.getElementById('file');
fileDom.addEventListener("change", function (e) {
  const file = fileDom.files[0];
  worker.postMessage(file);
});