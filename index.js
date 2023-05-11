const express = require("express");
require("dotenv").config();
const AuthError = require("./errors/autherror");
const ValidationError = require("./errors/validation_error");

const dbUtils = require("./utils/dbutils");

const userRouter = require("./routes/user_route");
const authRouter = require("./routes/auth_route");
const tagRouter = require("./routes/tag_route");
const productRouter = require("./routes/product_route");

const app = express();
const PORT = process.env.PORT || 3000;

dbUtils.initDB();
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/tag", tagRouter);
app.use("/api/product", productRouter);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.log("In error handler ", err);
  if (err instanceof AuthError) {
    console.log("In auth error handler ");
    return res.status(err.status).send({ message: err.message });
  } else if (err instanceof ValidationError) {
    console.log("In validation error handler ");
    return res.status(err.status).send({ message: err.message });
  }

  console.log("In error handler ", err);
  res.status(500).send({ message: err.message });
}

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});
