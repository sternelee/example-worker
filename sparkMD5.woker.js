import SparkMD5 from "spark-md5";

function md5(file) {
  console.log(file)
  let blobSlice = File.prototype.slice,
    chunkSize = 2097152, // 每段2M
    chunks = Math.ceil(file.size / chunkSize),
    currentChunk = 0,
    spark = new SparkMD5.ArrayBuffer(),
    fileReader = new FileReader();
  fileReader.onload = function (e) {
    console.log("read chunk nr", currentChunk + 1, "of", chunks);
    spark.append(e.target.result); // Append array buffer
    currentChunk++;

    if (currentChunk < chunks) {
      self.postMessage(currentChunk)
      loadNext();
    } else {
      console.log("finished loading");
      const result = spark.end(false);
      console.info("computed hash", result); // Compute hash
      self.postMessage(result);
    }
  };

  fileReader.onerror = function () {
    console.warn("oops, something went wrong.");
  };

  function loadNext() {
    let start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
  }
  loadNext();
}

self.onmessage = (e) => {
  console.log(e)
  const { file } = e.data;
  md5(file);
};
