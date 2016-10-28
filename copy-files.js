"use strict";

const fs    = require("fs"),
      files = require("../scripts/file-copy-details");

files.forEach((file) => {
  let from = fs.createReadStream(file.from),
      to   = fs.createWriteStream(file.to);

  console.log(`Copying ${file.from} to ${file.to}`);
  from.pipe(to);

  // Basic error handling
  from.on("error", (e) => {
    console.error(e);
  });
  to.on("error", (e) => {
    console.error(e);
  });
});
