"use strict";

/**
 * Required External Modules
 */
var express = require("express");

var path = require("path");
/**
 * App Variables
 */


var app = express();
var port = process.env.PORT || "8000";
/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express["static"](path.join(__dirname, "public")));
/**
 * Server Activation
 */

app.listen(port, function () {
  console.log("Listening to requests on http://localhost:".concat(port));
});
/**
 * Routes Definitions
 */

app.get("/", function (req, res) {
  res.render("main", {
    title: "Main Page"
  });
});
app.get("/contact", function (req, res) {
  res.render("contact", {
    title: "Contact"
  });
});