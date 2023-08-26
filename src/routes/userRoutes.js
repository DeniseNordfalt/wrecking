import { Router } from "express";
import User from "../models/user.js";

const userRoutes = Router();

userRoutes.get("/", async (req, res) => {
  res.render("users/new.ejs", { user: new User() });
});

userRoutes.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("users/new.ejs", { user: req.body, error: err.message });
  }
});

export default userRoutes;
