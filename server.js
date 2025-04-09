

import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const verificationCodes = []; 



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();





const app = express();
const PORT = 3000;


app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
app.use(
  session({
    secret: "mySuperSecret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 10,
});
app.use(limiter);


const getUsers = () => {
  try {
    const data = fs.readFileSync("users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; 
  }
};

const saveUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); 
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});
app.get("/login2", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login2.html"));
});
app.get("/account", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const users = getUsers();
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, email, password });
  saveUsers(users); 

  req.session.user = username;

  res.json({ redirect: "login.html" });
});


app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  
const code = Math.floor(10 + Math.random() * 90).toString();
req.session.user = username;
req.session.code = code;
req.session.email = user.email;


verificationCodes.push({
  username,
  code,
  createdAt: new Date().toISOString(), 
});


transporter.sendMail({
  from: `"MyApp" <${process.env.EMAIL_USER}>`,
  to: user.email,
  subject: "Your 2FA Code",
  text: `Your verification code is: ${code}`,
});


  
  res.cookie("verify", username, {  httpOnly: false });

  res.json({ redirect: "/login2" });
});


app.post("/verify-2fa", (req, res) => {
  const { code } = req.body;

  if (code === req.session.code) {
    const username = req.session.user;
    return res.json({
      redirect: "account.html",
      username: username,
    });
  }

  res.status(400).json({ message: "Invalid 2FA code" });
});


app.get("/account", (req, res) => {
  if (req.session.user) {
   
    return res.sendFile(path.join(__dirname, "public", "login.html"));
  } else {
    
    return res.status(401).json({ message: "Not logged in" });
  }
});


app.get("/account-data", (req, res) => {
  if (req.session.user) {
  
    return res.json({ username: req.session.user });
  } else {
    
    return res.status(401).json({ message: "Not logged in" });
  }
});


app.post("/logout", (req, res) => {
  req.session.destroy();
  res.clearCookie("verify");
  res.json({ message: "Logged out" });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
