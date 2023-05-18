const User = require("../model/user");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const AuthError = require("../errors/autherror");

exports.signup = async (name, email, password) => {
  console.log("In Auth SignUp  ");
  const user = new User({ name, email, password });
  await user.save();
  return user._id;
};

exports.login = async (email, inputPassword) => {
  console.log("In Auth login  ");
  const user = await User.findOne({ email, isActive: true }).select("+password");

  if (!user) {
    throw new AuthError("User not found");
  }
  // Check if password matches
  const isMatch = await bcrypt.compare(inputPassword, user.password);
  if (!isMatch) {
    throw new AuthError("Invalid credentials");
  }
  // Create a new Access Token with 1 day of expiration
  const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // Update user's token in DB
  await User.findOneAndUpdate({ _id: user._id }, { token: token });

  // Send the token back to client
  return token;
};

exports.logout = async (id) => {
  console.log("In Auth logout ");
  const user = await User.findOne({ _id: id });

  // remove token from DB
  await User.findOneAndUpdate({ _id: user._id }, { token: "" });
};

exports.verifyToken = async (token) => {
  console.log("In Auth verifyToken ", token);
  try {
    const payload = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: payload._id, isActive: true }).select("+token");
    if (!user) {
      throw new AuthError("User not found or deactivated");
    } else if (!user.token || user.token != token) {
      throw new AuthError("Access Denied. please login");
    }
    return user;
  } catch (err) {
    throw new AuthError(err.message);
  }
};
