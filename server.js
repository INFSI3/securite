const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "securite"))); // Serve static files from the "securite" folder
app.use(
  session({
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});
app.use(limiter);

// In-memory users (just for testing, use DB in real projects)
const users = [];

// Routes

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "securite", "index.html"));
});

// Register route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, email, password });
  console.log("New user:", { username, email });

  req.session.user = username;

  res.json({ redirect: "register.html" });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  req.session.user = username;
  res.json({ redirect: "login.html" }); // You'll need to create this page
});

// 2FA verification route
app.post("/verify-2fa", (req, res) => {
  const { code } = req.body;

  // For simplicity, let's say correct code is 123456
  if (code === "123456") {
    return res.json({ redirect: "login.html" });
  }

  res.status(400).json({ message: "Invalid 2FA code" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
