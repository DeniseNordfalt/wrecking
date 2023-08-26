import User from "../models/user.js";

//INDEX
// ! implement

//NEW
// ! implement

//CREATE
// ! implement

//private USER_PARAMS

const listUsers = async (req, res) => {
  const users = await User.find();
  //   res.render("users/index", { users });
  res.json(users);
};

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

export { listUsers, newUser };
