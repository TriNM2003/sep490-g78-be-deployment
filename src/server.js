const morgan = require("morgan");
const express = require("express");
const bodyParser = require("body-parser");
const httpsErrors = require("http-errors");
const cors = require("cors");
require("dotenv").config();
const allRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const passport = require("passport");
require("./configs/passport");

const path = require("path");

const http = require("http");
const db = require("./models");

const app = express();
const {userRouter} = require("./routes");


app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);


app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", allRoutes);
app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Server is running" });
});

// Định tuyến theo các chức năng thực tế

app.use("/users", userRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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
