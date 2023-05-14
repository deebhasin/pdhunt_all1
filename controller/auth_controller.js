const authService = require("../service/auth_service");
const AuthError = require("../errors/autherror");
const mongoose = require("mongoose");
const ValidationError = require("../errors/validation_error");

const handleErrors = (error, next) => {
  console.log("In handleAuthErrors ");
  if (error instanceof mongoose.Error.ValidationError) {
    next(new ValidationError(error.message));
  } else {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  console.log("In POST register User ");
  try {
    const { name, email, password } = req.body;
    const _id = await authService.signup(name, email, password);
    // console.log("user " + user);
    res.status(201).send({ id: _id });
  } catch (error) {
    handleErrors(error, next);
  }
};

exports.login = async (req, res, next) => {
  console.log("In POST login User ");
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
    console.log("In verifyToken ", req.headers);
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new Error({ message: "Access Denied. Please send Token" });

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error({ message: "Access Denied. Please send Token" });
    console.log("token " + token);

    const user = await authService.verifyToken(token);
    req.loggedInUser = user;
    next();
  } catch (error) {
    handleErrors(error, next);
  }
};
