const fs = require('fs');

fs.readFile('./dist/util.js', function (err, res) {
  if (err) {
    console.error(err)
  }
  console.log(res.toString())
})