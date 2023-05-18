const User = require("../model/user");
const userService = require("../service/user_service");

exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new Error("Email is mandatory");
    } else {
      const user = await userService.getUserByEmail(email);
      console.log("user " + user);
      if (!user) {
        throw new Error("User not found");
      }
      res.status(200).send(user);
    }
  } catch (error) {
    // console.log("error in user post ", error);
    res.status(400).send({ message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
