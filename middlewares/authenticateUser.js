import User from "../models/user.js";

const authenticateUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = User.findById(req.session.userId);
      if (user) {
        next();
      } else {
        req.session.message = "Please login to access this page.";
        console.log(req.session.message);
        res.redirect("/login");
      }
    } catch (err) {
      console.error(err);
      res.status(400).send("not authenticated" + err);
    }
  } else {
    req.session.message = "Please login to access this page.";
    console.log(req.session.message);
    res.redirect("/login");
  }
};

export default authenticateUser;
