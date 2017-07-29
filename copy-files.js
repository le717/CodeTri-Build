"use strict";

const fs     = require("fs"),
      path   = require('path'),
      mkdirp = require('mkdirp'),
      files  = require("./js-copy-details");

// Create dest directories
files.forEach((file) => {
  mkdirp(path.posix.dirname(file.to), (err) => {
    if (err) {
      console.error("Error creating destination folders!");
      console.error(err);
      return false;
    }
  });
});

// Copy each file
files.forEach((file) => {
  let from = fs.createReadStream(file.from),
      to   = fs.createWriteStream(file.to);

  console.log(`Copying ${file.from} to ${file.to}`);
  from.pipe(to);

  // Basic error handling
  from.on("error", (err) => {
    console.error("Error copying file to destination!");
    console.error(err);
  });
});
