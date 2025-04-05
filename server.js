// const express = require("express");
// const path = require("path");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const rateLimit = require("express-rate-limit");

// dotenv.config();

// const app = express();
// const PORT = 3000;

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "securite" folder
// app.use(
//   session({
//     secret: "mySuperSecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 10,
// });
// app.use(limiter);

// // In-memory users (just for testing, use DB in real projects)
// const users = [];

// // Routes

// // Serve the index.html file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// app.get("/register", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "register.html"));
//   });
//   app.get("/login", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });
   

//   app.get("/account", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });


// // Register route
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   const userExists = users.find((u) => u.username === username);
//   if (userExists) {
//     return res.status(400).json({ message: "Username already exists" });
//   }

//   users.push({ username, email, password });
//   console.log("New user:", { username, email });

//   req.session.user = username;

//   res.json({ redirect: "login.html" });
// });

// // Login route
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   req.session.user = username;
//   res.json({ redirect: "login2.html" }); // You'll need to create this page
// });

// // 2FA verification route
// app.post("/verify-2fa", (req, res) => {
//   const { code } = req.body;

//   // For simplicity, let's say correct code is 123456
//   if (code === "123456") {
//     return res.json({ redirect: "login.html" });
//   }

//   res.status(400).json({ message: "Invalid 2FA code" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });













  // const express = require("express");
// const path = require("path");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const rateLimit = require("express-rate-limit");

// dotenv.config();

// const app = express();
// const PORT = 3000;

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "securite" folder
// app.use(
//   session({
//     secret: "mySuperSecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 10,
// });
// app.use(limiter);

// // In-memory users (just for testing, use DB in real projects)
// const users = [];

// // Routes

// // Serve the index.html file
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });
// app.get("/register", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "register.html"));
//   });
//   app.get("/login", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });
   

//   app.get("/account", (req, res) => {
//     res.sendFile(path.join(__dirname, "public", "login.html"));
//   });


// // Register route
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   const userExists = users.find((u) => u.username === username);
//   if (userExists) {
//     return res.status(400).json({ message: "Username already exists" });
//   }

//   users.push({ username, email, password });
//   console.log("New user:", { username, email });

//   req.session.user = username;

//   res.json({ redirect: "login.html" });
// });

// // Login route
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   req.session.user = username;
//   res.json({ redirect: "login2.html" }); // You'll need to create this page
// });

// // 2FA verification route
// app.post("/verify-2fa", (req, res) => {
//   const { code } = req.body;

//   // For simplicity, let's say correct code is 123456
//   if (code === "123456") {
//     return res.json({ redirect: "login.html" });
//   }

//   res.status(400).json({ message: "Invalid 2FA code" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });









const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const nodemailer = require("nodemailer"); // ⬅️ جديد
const fs = require("fs"); // مكتبة لقراءة وكتابة الملفات
const { get } = require("http");

dotenv.config();

const app = express();
const PORT = 3000;

// Middlewares
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

// Rate limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
});
app.use(limiter);

// Read existing users from users.json file
const getUsers = () => {
  try {
    const data = fs.readFileSync("users.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Return an empty array if file doesn't exist or is empty
  }
};

const saveUsers = (users) => {
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); // Save users to users.json
};

// إعداد nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // استخدام البريد الإلكتروني من .env
    pass: process.env.EMAIL_PASS, // استخدام كلمة المرور من .env
  },
});

// Routes

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/account", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Register route
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;

  const users = getUsers();
  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, email, password });
  saveUsers(users); // Save new user to users.json

  req.session.user = username;

  res.json({ redirect: "login.html" });
});

// Login route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate 2FA code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  req.session.user = username;
  req.session.code = code;
  req.session.email = user.email;

  // Send code via email
  transporter.sendMail({
    from: `"MyApp" <${process.env.EMAIL_USER}>`, // Corrected here: use backticks
    to: user.email,
    subject: "Your 2FA Code",
    text: `Your verification code is: ${code}`, // Corrected here: use backticks
  });

  // Set the username in the cookies
  res.cookie("verify", username, { maxAge: 900000, httpOnly: true });

  res.json({ redirect: "login2.html" });
});

// 2FA verification
app.post("/verify-2fa", (req, res) => {
  const { code } = req.body;

  if (code === req.session.code) {
    // After successful 2FA, redirect to the account page
    return res.json({ redirect: "login.html" });
  }

  res.status(400).json({ message: "Invalid 2FA code" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});






// const express = require("express");
// const path = require("path");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const rateLimit = require("express-rate-limit");
// const nodemailer = require("nodemailer");
// const fs = require("fs");

// dotenv.config();

// const app = express();
// const PORT = 3000;

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
// app.use(
//   session({
//     secret: "mySuperSecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 10,
// });
// app.use(limiter);

// // Read existing users from users.json file
// const getUsers = () => {
//   try {
//     const data = fs.readFileSync("users.json", "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     return []; // Return an empty array if file doesn't exist or is empty
//   }
// };

// const saveUsers = (users) => {
//   fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); // Save users to users.json
// };

// // إعداد nodemailer (Gmail transporter)
// const transporterGmail = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // استخدام البريد الإلكتروني من .env
//     pass: process.env.EMAIL_PASS, // استخدام كلمة المرور من .env
//   },
// });

// // Routes

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/register", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "register.html"));
// });

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// app.get("/account", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// // Register route
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   const users = getUsers();
//   const userExists = users.find((u) => u.username === username);
//   if (userExists) {
//     return res.status(400).json({ message: "Username already exists" });
//   }

//   users.push({ username, email, password });
//   saveUsers(users); // Save new user to users.json

//   // Send a welcome email after registration
//   transporterGmail.sendMail({
//     from: `"MyApp" <${process.env.EMAIL_USER}>`, // Use the email from .env
//     to: email,
//     subject: "Welcome to MyApp",
//     text: `Hello ${username},\n\nThank you for registering with MyApp! We're excited to have you on board.`,
//   }, (error, info) => {
//     if (error) {
//       console.log("Error sending welcome email:", error);
//     } else {
//       console.log("Welcome email sent successfully:", info.response);
//     }
//   });

//   req.session.user = username;

//   res.json({ redirect: "login.html" });
// });

// // Login route
// app.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const users = getUsers();
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   // Generate 2FA code
//   const code = Math.floor(100000 + Math.random() * 900000).toString();
//   req.session.user = username;
//   req.session.code = code;
//   req.session.email = user.email;

//   // Send 2FA code via email
//   transporterGmail.sendMail({
//     from: `"MyApp" <${process.env.EMAIL_USER}>`,
//     to: user.email,
//     subject: "Your 2FA Code",
//     text: `Hello ${username},\n\nYour verification code is: ${code}\n\nPlease use this code to complete your login.`,
//   }, (error, info) => {
//     if (error) {
//       console.log("Error sending 2FA email:", error);
//     } else {
//       console.log("2FA code sent successfully:", info.response);
//     }
//   });

//   // Set the username in the cookies
//   res.cookie("verify", username, { maxAge: 900000, httpOnly: true });

//   res.json({ redirect: "login2.html" });
// });

// // 2FA verification
// app.post("/verify-2fa", (req, res) => {
//   const { code } = req.body;

//   if (code === req.session.code) {
//     // After successful 2FA, redirect to the account page
//     return res.json({ redirect: "login.html" });
//   }

//   res.status(400).json({ message: "Invalid 2FA code" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });





// const express = require("express");
// const path = require("path");
// const session = require("express-session");
// const cookieParser = require("cookie-parser");
// const crypto = require("crypto");
// const dotenv = require("dotenv");
// const rateLimit = require("express-rate-limit");
// const nodemailer = require("nodemailer");
// const fs = require("fs");

// dotenv.config();

// const app = express();
// const PORT = 3000;

// // Middlewares
// app.use(express.json());
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" folder
// app.use(
//   session({
//     secret: "mySuperSecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// // Rate limiter
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 10,
// });
// app.use(limiter);

// // Read existing users from users.json file
// const getUsers = () => {
//   try {
//     const data = fs.readFileSync("users.json", "utf8");
//     return JSON.parse(data);
//   } catch (error) {
//     return []; // Return an empty array if file doesn't exist or is empty
//   }
// };

// const saveUsers = (users) => {
//   fs.writeFileSync("users.json", JSON.stringify(users, null, 2)); // Save users to users.json
// };

// // Setup Nodemailer for Gmail
// const transporterGmail = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER, // Your Gmail email from .env
//     pass: process.env.EMAIL_PASS, // Your Gmail app password from .env
//   },
// });

// // Routes

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// app.get("/register", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "register.html"));
// });

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// app.get("/account", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "login.html"));
// });

// // Register route
// app.post("/register", (req, res) => {
//   const { username, email, password } = req.body;

//   const users = getUsers();
//   const userExists = users.find((u) => u.username === username);
//   if (userExists) {
//     return res.status(400).json({ message: "Username already exists" });
//   }

//   users.push({ username, email, password });
//   saveUsers(users); // Save new user to users.json

//   // Send a welcome email after registration
//   transporterGmail.sendMail({
//     from: `"MyApp" <${process.env.EMAIL_USER}>`, // Use the email from .env
//     to: email,
//     subject: "Welcome to MyApp",
//     text: `Hello ${username},\n\nThank you for registering with MyApp! We're excited to have you on board.`,
//   }, (error, info) => {
//     if (error) {
//       console.log("Error sending welcome email:", error);
//     } else {
//       console.log("Welcome email sent successfully:", info.response);
//     }
//   });

//   req.session.user = username;

//   res.json({ redirect: "login.html" });
// });

// // Login route
// app.post("/login", (req, res) => {
//   const { username, password, email } = req.body; // Get email from the request body
//   const users = getUsers();
//   const user = users.find((u) => u.username === username && u.password === password);

//   if (!user) {
//     return res.status(401).json({ message: "Invalid username or password" });
//   }

//   // Ensure the email matches the one on record
//   if (user.email !== email) {
//     return res.status(400).json({ message: "Invalid email" });
//   }

//   // Generate 2FA code
//   const code = Math.floor(100000 + Math.random() * 900000).toString();
//   req.session.user = username;
//   req.session.code = code;
//   req.session.email = email; // Store the email in the session

//   // Send the 2FA code to the entered email
//   transporterGmail.sendMail({
//     from: `"MyApp" <${process.env.EMAIL_USER}>`,
//     to: email, // Send to the entered email
//     subject: "Your 2FA Code",
//     text: `Hello ${username},\n\nYour verification code is: ${code}\n\nPlease use this code to complete your login.`,
//   }, (error, info) => {
//     if (error) {
//       console.log("Error sending 2FA email:", error);
//     } else {
//       console.log("2FA code sent successfully:", info.response);
//     }
//   });

//   // Set the username in cookies
//   res.cookie("verify", username, { maxAge: 900000, httpOnly: true });

//   res.json({ redirect: "login2.html" });
// });

// // 2FA verification
// app.post("/verify-2fa", (req, res) => {
//   const { code } = req.body;

//   if (code === req.session.code) {
//     // If the code matches, redirect to the account page
//     return res.json({ redirect: "account.html" });
//   }

//   res.status(400).json({ message: "Invalid 2FA code" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });
