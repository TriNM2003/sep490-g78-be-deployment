const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const httpsErrors = require("http-errors");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const passport = require("./configs/passport.config");

const {userRouter, authRouter, questionRouter} = require("./routes");
const path = require("path");
const http = require("http");
const db = require("./models");
const app = express();
const session = require("express-session");

// Sử dụng cors middleware để cho phép request từ localhost:3000
app.use(
  cors({
    origin: [`${process.env.FE_URL_USER}`, `${process.env.FE_URL_ADMIN}`],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
// passport oauth
app.use(
  session({
    secret: "pawShelterGoogleLogin",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});

// Định tuyến theo các chức năng thực tế

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/questions", questionRouter);

app.use(async (req, res, next) => {
  next(httpsErrors(404, "Bad Request"));
});
app.use(async (err, req, res, next) => {
  resStatus = err.status || 500;
  return res
    .status(resStatus || 500)
    .json({ error: { status: err.status, message: err.message } });
});

const host = process.env.HOSTNAME;
const port = process.env.PORT;

app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
  db.connectDB();
});