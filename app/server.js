const express = require("express");
const fileSystem = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Video stream endpoint
app.get("/video/:filename", (req, res) => {
  const filePath = path.join(__dirname, "videos", req.params.filename);

  if (!fileSystem.existsSync(filePath)) {
    return res.status(404).send("File not found");
  }

  const stat = fileSystem.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    return res.status(416).send("Range not specified");
  }

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      return res.status(416).send("Requested range not satisfiable");
    }

    const chunkSize = end - start + 1;
    const fileStream = fileSystem.createReadStream(filePath, { start, end });
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fileSystem.createReadStream(filePath).pipe(res);
  }
});

// Default route
app.get("/", (req, res) => {
  res.send("Welcome to the video streaming server!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
