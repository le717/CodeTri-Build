/* global process */
"use strict";

const fs       = require("fs"),
      path     = require("path"),
      uglifyjs = require("uglify-js"),

      // Root project directory
      rootDir = process.cwd(),

      // I/O details
      input      = [],
      output     = require("../scripts/js-build-details"),
      outputPath = path.join(rootDir, "build", "js", output.details.outputFile);


/**
 * @private
 * Determine if a script should be excluded from the build.
 *
 * @param {string} file - File name of script.
 * @param {string} type - Category this script belongs to.
 *                        Acceptable values are "lib" and "main".
 * @returns {boolean} True if script should be excluded, False otherwise.
 */
function _shouldExclude(file, type) {
  let result = false;

  if (output.exceptions[type] && output.exceptions[type].length > 0) {
    result = output.exceptions[type].indexOf(file) > -1;
  }

  return result;
}

// Switch to where we keep out scripts
process.chdir(path.join(rootDir, "js"));

// Get the get the third-party libaries to be minified
// TODO Change to async methods
fs.readdirSync(path.resolve(process.cwd(), "lib")).forEach(file => {
  let fName = path.resolve("lib", file),
      stats = fs.statSync(fName);

  if (!_shouldExclude(file, "lib") && stats.isFile()) {
    input.push(fName);
  }
});

// Get our own scripts to be minified
fs.readdirSync(process.cwd()).forEach(file => {
  let fName = path.resolve(file),
      stats = fs.statSync(fName);

  if (!_shouldExclude(file, "main") && stats.isFile()) {
    input.push(fName);
  }
});

// Build the JS and write it to file
let compress = uglifyjs.minify(input, {
  mangle: true,
  compress: {
    screw_ie8: true,
    drop_console: true
  }
});
fs.writeFileSync(outputPath, compress.code);

// Check build result
try {
  fs.statSync(outputPath);
  console.log("JavaScript built successfully.");

  // It did not build
} catch (Error) {
  console.error("Unable to build JavaScript.");
}
