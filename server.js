const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "change-this-secret",
    resave: false,
    saveUninitialized: false,
  })
);

const PASSWORD = "please_open";

// Serve all files only if authenticated
app.use((req, res, next) => {
  if (req.session.authed) {
    express.static(__dirname)(req, res, next);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  if (req.session.authed) {
    res.sendFile(path.join(__dirname, "index.html"));
  } else {
    res.send(`
      <form method="POST" action="/login">
        <input type="password" name="password" placeholder="Enter password" />
        <button>Enter</button>
      </form>
    `);
  }
});

app.post("/login", (req, res) => {
  if (req.body.password === PASSWORD) {
    req.session.authed = true;
    res.redirect("/");
  } else {
    res.send("Wrong password");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
