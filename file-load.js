import DynamicWorker from './DynamicWorker';

const fileLoad = `{
  calculateBlockSize: function (size) {
    if (size >= 0 && size <= (128 << 20)) {
      return 256 << 10
    }
    if (size > (128 << 20) && size <= (256 << 20)) {
      return 512 << 10
    }
    if (size > (256 << 20) && size <= (512 << 20)) {
      return 1024 << 10
    }
    return 2048 << 10
  },
  load: function (file) {
    const reader = new FileReader();
    reader.onload = async () => {
      console.log(reader.result);
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file);
  }
}`;

const worker = new DynamicWorker(fileLoad);

const fileDom = document.getElementById('file');
fileDom.addEventListener("change", function (e) {
  const file = fileDom.files[0];
  worker.dispatch('load', file)
    .then(res => {
      console.log(res);
    })
});