const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const cors = require("cors");

const thumbsupply = require("thumbsupply");
const { getVideoDurationInSeconds } = require("get-video-duration");

const videos = [
  {
    id: 0,
    poster: "/video/0/poster",
    duration: "3 mins",
    name: "sample1",
  },
  {
    id: 1,
    poster: "/video/1/poster",
    duration: "4 mins",
    name: "sample2",
  },
];

app.use(cors());
app.get("/videos", (req, res) => res.json(videos));

app.get("/video/:id/data", (req, res) => {
  const id = parseInt(req.params.id, 10);
  res.json(videos[id]);
});

app.get("/video/:id/poster", (req, res) => {
  thumbsupply
    .generateThumbnail(`assets/${req.params.id}.mp4`)
    .then((thumb) => res.sendFile(thumb));
});

app.get("/video/:id", (req, res) => {
  const path = `assets/${req.params.id}.mp4`;
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(206, head);
    getVideoDurationInSeconds(file).then((duration) => {
      console.log(duration);
    });
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.get("/video/:id/caption", (req, res) =>
  res.sendFile("assets/captions/sample.vtt", { root: __dirname })
);

app.listen(4000, () => {
  console.log("Listening on port 4000!");
});
