//extends from router TODO

videoGetter() {
    this.router.get("/video/:path", async (req, res) => {
      if (!req.params.path) return res.status(404).json(ERROR.uncomplete);
      const path = "./public/video/" + req.params.path;
      fs.stat(path, (err, stat) => {
        // Handle file not found
        if (err !== null && err.code === "ENOENT") {
          return res.sendStatus(404);
        }

        const fileSize = stat.size;
        const range = req.headers.range; //the part request of the vidéo

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          //split parts to table [start, end]

          const start = parseInt(parts[0], 10); //parse String to int base 10
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          const chunksize = end - start + 1;
          const file = fs.createReadStream(path, { start, end });
          const head = {
            "Content-Range": `bytes ${start}-${end}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
          };

          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            "Content-Length": fileSize,
            "Content-Type": "video/mp4"
          };

          res.writeHead(200, head);
          fs.createReadStream(path).pipe(res);
        }
      });
    });
  }