const express = require("express");
const cors = require("cors");
require("dotenv").config();
const errorController = require("./controller/error_controller");

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
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/tag", tagRouter);
app.use("/api/product", productRouter);
app.use(errorController.handleErrors);

process.on("SIGINT", () => {
  dbUtils.disconnectDB();
  console.log("Closing server");
  process.exit();
});

process.on("exit", () => {
  console.log("Server closed");
});

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
