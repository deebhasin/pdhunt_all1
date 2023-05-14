exports.handleErrors = (err, req, res, next) => {
  console.log("In error handler ", err);
  const node_env = process.env.NODE_ENV || "development";
  if (node_env === "production") {
    sendErrorProd(err, req, res);
  } else {
    sendErrorDev(err, req, res);
  }
};

function sendErrorDev(err, req, res) {
  res.status(err.status || 500).json({
    user: req.user?.name || "Unknown",
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err, req, res) {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!. Please try again later",
    });
  }
}
