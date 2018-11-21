const express = require('express');
const app = express();
const fs = require('file-system');

app.use(express.static('./'));

app.get('/video', function(req, res) {
  const path = 'techlead.mp4'
  const stat = fs.statSync(path)
  const fileSize = stat.size
  const range = req.headers.range
  console.log(req.headers)
  if (range) {
    const obj = {
        stat,
        fileSize,
        range
    }
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
  }
});

app.get('/', function(req, res) {
    res.render('index.html')
})

app.listen(3000, function () {
    console.log('Video Stream Server is on!!');
})
