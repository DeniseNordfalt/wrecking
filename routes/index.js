import { Router } from "express";
import User from "../models/user.js";
import Station from "../models/station.js";
import Team from "../models/team.js";
import Round from "../models/round.js";

import resetRoutes from "./resetRoutes.js";
import stationRoutes from "./stationRoutes.js";
import teamRoutes from "./teamRoutes.js";

import codeRoutes from "./codeRoutes.js";
import reportRoutes from "./reportRoutes.js";

import roundRoutes from "./roundRoutes.js";
import adminRoutes from "./adminRoutes.js";
import publicRoutes from "./publicRoutes.js";
import userRoutes from "./userRoutes.js";

import authenticateUser from "../middlewares/authenticateUser.js";
import responseFormatter from "../middlewares/responseFormatter.js";

import methodOverride from "method-override";

const routes = Router();

routes.use(methodOverride("_method"));

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
routes.get("/test", (req, res) => {
  res.format({
    "text/html"() {
      res.render("test/index.ejs", { message: "test" });
    },
    "application/json"() {
      res.send({ message: "test" });
    },
    default() {
      res.status(406).send("Not Acceptable");
    },
  });
});

routes.post("/test", (req, res) => {
  res.send("post");
});

routes.patch("/test", (req, res) => {
  res.send("patch");
});

routes.get("/public", function (req, res) {
  res.send("public");
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
routes.use("/public", publicRoutes);
routes.use("/rounds", authenticateUser, roundRoutes);
routes.use("/reset", authenticateUser, resetRoutes);
routes.use("/stations", authenticateUser, stationRoutes);
routes.use("/teams", authenticateUser, teamRoutes);
routes.use("/calibration_codes", codeRoutes);
routes.use("/reports", reportRoutes);
routes.use("/users", userRoutes);

export default routes;
