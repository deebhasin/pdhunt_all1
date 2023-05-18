const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorController = require("./controller/error_controller");
const multer = require("multer");
const morgan = require("morgan");
const logger = require("./utils/logger");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");

const dbUtils = require("./utils/dbutils");

const userRouter = require("./routes/user_route");
const authRouter = require("./routes/auth_route");
const tagRouter = require("./routes/tag_route");
const productRouter = require("./routes/product_route");

const app = express();
const PORT = process.env.PORT || 3000;

dbUtils.initDB();

app.use(express.json());
app.use(cors());

const morganMiddleware = morgan(
  function (tokens, req, res) {
    return JSON.stringify({
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number.parseFloat(tokens.status(req, res)),
      content_length: tokens.res(req, res, "content-length"),
      response_time: Number.parseFloat(tokens["response-time"](req, res)) + " ms",
    });
  },
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        logger.http(message);
      },
    },
  }
);
app.use(morganMiddleware);
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/tag", tagRouter);
app.use("/api/product", productRouter);
app.use(errorController.handleErrors);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/" + file.fieldname);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, "ankit" + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("fileName"), (req, res) => {
  logger.log(req.file);
  res.status(200).json({ message: "OK" });
});

app.get("/api/", (req, res) => {
  const dbStatus = dbUtils.isConnected();

  const response = {
    message: "Express Server is UP and DB is connected : " + dbStatus,
    status: dbStatus ? "OK" : "ERROR",
  };

  res.status(200).json(response);
});

app.get("/api/retry", (req, res) => {
  dbUtils.initDB();

  res.status(200).json({ retry: "OK" });
});

app.post("/api/loglevel/:level", (req, res) => {
  logger.level = req.params.level;

  res.status(200).json({ "level set": logger.level });
});

process.on("SIGINT", () => {
  try {
    dbUtils.disconnectDB();
  } catch (error) {}
  process.exit();
});

process.on("exit", () => {
  logger.log("debug", "Server closed");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  logger.info("Server is running on port " + PORT);
});
