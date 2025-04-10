import express from "express";
import path from "path";
import session from "express-session";
import cookieParser from "cookie-parser";
import fs from "fs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = 3000;

const verificationCodes = [];

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "veryweaksecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

const getUsers = () => {
  try {
    const data = fs.readFileSync("users.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
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

app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/login2", (req, res) => {
  // get username from the verify cookie
  const verifyCookie = req.cookies.verify;
  if (!verifyCookie) {
    return res.status(401).json({ message: "Invalid request!" });
  }
  // generate code
  const code = Math.floor(10 + Math.random() * 90).toString();
  // get user email & user name
  const username = verifyCookie;
  const user = getUsers().find((u) => u.username === username);
  if (!user) {
    return res
      .status(401)
      .json({ message: "Invalid request! (Username is not valid)" });
  }
  const userEmail = user.email;
  console.log("email: ", userEmail);
  // store code
  verificationCodes.push({
    username: username,
    email: userEmail,
    code,
    createdAt: new Date().toISOString(),
  });

  transporter.sendMail({
    from: `"web.sec.email" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Verification Code",
    text: `Your verification code is: ${code}`,
  });
  res.sendFile(path.join(__dirname, "public", "login2.html"));
});

app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const users = getUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username, email, password });
  saveUsers(users);

  req.session.user = username;
  req.session.email = email;

  res.json({ redirect: "/login" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  // validate user
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  // use session
  req.session.user = username;
  // use verify cookie
  res.cookie("verify", username, { httpOnly: false });
  // redirect
  res.json({ redirect: "/login2" });
});

app.post("/verify-2fa", (req, res) => {
  const { code } = req.body;
  const verifyCookie = req.cookies.verify;
  if (!verifyCookie) {
    return res.status(401).json({ message: "Invalid request!" });
  }

  // Find the verification code for this user
  const verificationEntry = verificationCodes.find(
    (v) => v.username === verifyCookie && v.code === code
  );
  if (verificationEntry) {
   
    const index = verificationCodes.indexOf(verificationEntry);
    verificationCodes.splice(index, 1);
    
    
    req.session.user = verificationEntry.username;
    req.session.isAuthenticated = true;
    req.session.email = verificationEntry.email;
    res.clearCookie("verify");
   
    return res.json({ redirect: "/account" });
  }
  res.status(400).json({ message: "Invalid 2FA code" });
});

app.get("/account", (req, res) => {
  // Add isAuthenticated check
  if (!req.session.isAuthenticated) {
    // return res.status(401).send("Unauthorized");
    return res.redirect("/login");
      // res.sendFile(path.join(__dirname, "public", "login.html"));
  
  }
  
  if (req.session.user && req.session.email) {
    return res.sendFile(path.join(__dirname, "public", "account.html"));
  }
  res.status(401).send("Unauthorized");
});

app.get("/account-data", (req, res) => {
  
  if (req.session.user && req.session.isAuthenticated) {
    return res.json({ 
      username: req.session.user,
      email: req.session.email 
    });
  }
  res.status(401).json({ message: "Not authenticated" });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("verify");
    res.json({ message: "Logged out" });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});
