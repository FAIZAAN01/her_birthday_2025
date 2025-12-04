import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";  // <- import fs as ES module

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: false }
}));

app.use(express.urlencoded({ extended: true }));

const PASSWORD = process.env.DEMO_PASSWORD;

// ---------- LOGIN PAGE ----------
app.get("/", (req, res) => {
  if (req.session.loggedIn) return res.redirect("/secure");
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- HANDLE LOGIN ----------
app.post("/index", (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    req.session.loggedIn = true;
    return res.redirect("/secure");
  } else {
    return res.send("<h2>Wrong Password</h2><a href='/'>Try Again</a>");
  }
});

// ---------- SECURE PAGE ----------
app.get("/secure", (req, res) => {
  if (!req.session.loggedIn) return res.status(403).send("Forbidden");

  // Read your Web3Forms key from .env
  const key = process.env.shinu;

  // Read HTML file using ES module fs
  let html = fs.readFileSync(path.join(__dirname, "public", "secure.html"), "utf8");

  // Replace placeholder with actual key
  html = html.replace("shinu_PLACEHOLDER", key);

  res.send(html);
});

// ---------- LOGOUT ----------
app.post("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
