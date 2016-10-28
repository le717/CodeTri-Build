/* global process */
"use strict";

const fs           = require("fs"),
      path         = require("path"),
      sass         = require("node-sass"),
      postcss      = require("postcss"),
      autoprefixer = require("autoprefixer"),

      // Root project directory
      rootDir = process.cwd(),

      // I/O details
      output     = require("../scripts/scss-build-details"),
      outputPath = path.join(rootDir, "build", "css", output.details.outputFile);


/**
 * Vendor-prefix the CSS using Autoprefixer.
 *
 * @param {string} css - CSS to be prefixed.
 */
function prefixCSS(css) {
  return postcss([autoprefixer]).process(css);
}

/**
 * Write the CSS to file.
 *
 * @param {string} css - CSS to be written.
 */
function saveCSS(css) {
    fs.writeFile(outputPath, css, (err) => {
    if (err) {
      console.error("Unable to build CSS.");
      throw new Error(err);
    }
    console.log("CSS built successfully.");
  });
}

// Switch to where we keep out scripts
process.chdir(path.join(rootDir, "scss"));

// Compile the SCSS
sass.render({
  file: output.details.inputFile,
  outputStyle: output.details.scssStyle,
  indentedSyntax: output.details.indented

}, (err, result) => {
  // There was an error generating the CSS
  if (err) throw new Error(err);

  // Run the CSS through Autoprefixer
  prefixCSS(result.css)
  .then((result) => {
    result.warnings().forEach((warn) => {
        console.warn(warn.toString());
    });

    // Write it to disk
    saveCSS(result.css);
  });
});
