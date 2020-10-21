/**
 * Required External Modules
 */
const express = require("express");
const path = require("path");

/**
 * App Variables
 */
const app = express();
const port = process.env.PORT || "8000";

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

/**
 * Server Activation
 */

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});

/**
 * Routes Definitions
 */
app.get("/", (req, res) => {
    res.render("main", { title: "Main Page" });
});

app.get("/contact", (req, res) => {
    res.render("contact", { title: "Contact" });
});