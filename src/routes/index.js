import { Router } from "express";
import User from "../models/user.js";
import Station from "../models/station.js";
import Team from "../models/team.js";
import Round from "../models/round.js";

import stationRoutes from "./stationRoutes.js";
import teamRoutes from "./teamRoutes.js";

import reportRoutes from "./reportRoutes.js";

import roundRoutes from "./roundRoutes.js";
import adminRoutes from "./adminRoutes.js";
import userRoutes from "./userRoutes.js";

import calibrationCodeRoutes from "./calibrationCodesRoutes.js";

import authenticateUser from "../middlewares/authenticateUser.js";

import methodOverride from "method-override";

const routes = Router();

routes.use(methodOverride("_method"));

/* 
Application Controller:

PUT /reset_all - Custom action for resetting all

Public Controller:

GET /public - Index action (root)
GET /public/teams - Custom collection action for listing teams

Sessions Controller:

GET /login - New action (login form)
POST /login - Create action (login)
DELETE /logout - Destroy action (logout)
Admin Controller:

GET /index - Index action
Root Route:

Root URL (/) is mapped to public#index

*/



routes.get("/", async (req, res, next) => {
  try {
    const [stations, teams, [activeRound], comingRounds] = await Promise.all([
      Station.find().populate("team"),
      Team.find(),
      Round.find({ active: true }).sort({ endtime: "desc" }).limit(1),
      Round.find({ active: false, starttime: { $gt: new Date() } }).sort({
        starttime: "asc",
      }),
    ]);
    res.render("public/index", {
      stations,
      teams,
      activeRound,
      comingRounds,
    });
  } catch (err) {
    next(err);
  }
});

routes.get("/login", function (req, res) {
  res.render("sessions/new.ejs", { user: new User(), error: "" });
});

routes.post("/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    req.session.userId = user._id;

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("sessions/new.ejs", { user: req.body, error: err.message });
  }
});

routes.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/");
  });
});

routes.use("/admin", adminRoutes);
routes.use("/rounds", authenticateUser, roundRoutes);
routes.use("/stations", authenticateUser, stationRoutes);
routes.use("/teams", authenticateUser, teamRoutes);
routes.use("/reports", reportRoutes);
routes.use("/users", userRoutes);
routes.use("/calibration_codes", calibrationCodeRoutes);

export default routes;
