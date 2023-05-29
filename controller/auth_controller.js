const authService = require("../service/auth_service");
const AuthError = require("../errors/autherror");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const ValidationError = require("../errors/validation_error");

const handleErrors = (error, next) => {
  logger.debug("In handleAuthErrors ");
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else if (error.code && error.code == 11000) {
    next(new ValidationError(error.message));
  } else {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  logger.debug("In POST register User ");
  try {
    const { name, email, password, role } = req.body;
    const _id = await authService.signup(name, email, password, role);
    // logger.debug("user " + user);
    res.status(201).send({ id: _id });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.login = async (req, res, next) => {
  logger.debug("In POST login User ");
  try {
    const { email, password: inputPassword } = req.body;
    const token = await authService.login(email, inputPassword);
    res.status(200).send({ token: token });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.logout = async (req, res, next) => {
  try {
    let loggedInUser = req.loggedInUser;

    await authService.logout(loggedInUser._id);
    res.status(200).send({ message: "Logged out successfully" });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.verifyToken = async (req, res, next) => {
  try {
    logger.debug("In verifyToken ", req.headers);
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new Error({ message: "Access Denied. Please send Token" });

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error({ message: "Access Denied. Please send Token" });
    logger.debug("token " + token);

    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.authorize = (roles) => {
  return (req, res, next) => {
    const user = req.loggedInUser;
    logger.debug("In authorize " + user);
    if (roles.includes(user.role)) {
      next();
    } else {
      next(new AuthError("Access Denied. You are not authorized", 403));
    }
  };
};
