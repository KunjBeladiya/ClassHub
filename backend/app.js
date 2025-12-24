const express = require("express");
const cors = require("cors");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

require("./src/config/passport.js");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://class-hub-mu.vercel.app"
    ], // your React frontend origin
    credentials: true,               // allow cookies (sessions) to be sent
  })
);

app.use(cookieParser());

app.set("trust proxy", 1); 
app.use(session({
  secret: "your-secret-key", // Change this to a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 1000, // session cookie valid for 5 minutes
    httpOnly: true,
    secure: true, // set true only if using HTTPS
    sameSite: "none"
  }
}));



app.use(passport.initialize());
app.use(passport.session());

app.get("/" , (req,res) => {
    res.send("<h1>Server running......</h1>")
});

app.use("/auth", require("./src/routes/GauthRoutes.js"));

app.use("/api/v1" , require("./src/routes/authRoutes.js"));

app.use("/api/v1" , require("./src/routes/resourceRoutes.js"));

app.use("/api/v1/forum" , require("./src/routes/forumRoutes.js"));

app.use("/api/v1/event" , require("./src/routes/eventRoutes.js"));

app.use("/api/v1/admin" , require("./src/routes/adminRoute.js"));

app.use("/api/v1/user" , require("./src/routes/userRoute.js"));

module.exports = app;

