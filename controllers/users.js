import express from "express";
import User from "../models/user.js";

// router.use(authenticateUser);

const listUsers = async (req, res) => {
  const users = await User.find();
  //   res.render("users/index", { users });
  res.json(users);
};

// const listUserDetail = async (req, res) => {
//   const user = new User();
//   res.render("users/new", { user });
// };

const newUser = () => async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();
    // res.redirect("/index");
  } catch (error) {
    res.redirect("back");
  }
};

function authenticateUser(req, res, next) {
  // authenticate user logic here
}

export { listUsers, newUser };
