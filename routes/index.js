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

import authenticate from "../middlewares/authenticate.js";

//import { listUsers, newUser } from "../controllers/users.js";

const routes = Router();
/*
routes.get("/", function (req, res) {
  const baseUrl = req.baseUrl;

  // Get all the paths from the router stack
  const paths = routes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);

  // Get all the paths from the 'use' statements
  const usePaths = [
    "/rounds",
    "/reset",
    "/stations",
    "/teams",
    "/codes",
    "/reports",
  ];

  // Combine all the paths
  const allPaths = [...paths, ...usePaths];

  const links = allPaths
    //.filter((path) => path !== "/") // Filter out the root path
    .map((path) => `<li><a href="${baseUrl}${path}">${path}</a></li>`)
    .join("");

  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
});
*/

routes.get("/", (req, res, next) => {
  Promise.all([
    Station.find(),
    Team.find(),
    Round.find({ active: true }).sort({ endtime: "desc" }).limit(1),
    Round.find({ active: false, starttime: { $gt: new Date() } }).sort({
      starttime: "asc",
    }),
  ])
    .then(([stations, teams, [activeRound], comingRounds]) => {
      res.render("public/index", {
        stations,
        teams,
        activeRound,
        comingRounds,
      });
      //res.send({ stations, teams, activeRound, comingRounds });
    })
    .catch(next);
});

routes.get("/test", authenticate, (req, res) => {
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

routes.get("/public", function (req, res) {
  // handle request for public page
  res.send("public");
});

// routes.get("/users", listUsers);
routes.get("/users", async (req, res) => {
  res.render("users/new.ejs", { user: new User() });
});
routes.post("/users", async (req, res) => {
  try {
    const { name, email, password_digest } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Create new user
    const user = new User({ name, email, password_digest });
    await user.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("users/new.ejs", { user: req.body, error: err.message });
  }
});

routes.get("/login", function (req, res) {
  // handle request for login page

  // res.render("users/login.ejs", { user: new User() });
  res.render("sessions/new.ejs", { user: new User(), error: "" });
});

routes.post("/login", function (req, res) {
  const { email, password } = req.body;

  try {
    const user = User.findByEmailAndPassword(email, password);
    req.session.userId = user.id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("sessions/new.ejs", { user: req.body, error: err.message });
  }
});

routes.delete("/logout", function (req, res) {
  // handle logout
  res.send("logout");
});

routes.use("/admin", adminRoutes);
routes.use("/public", publicRoutes);
routes.use("/rounds", authenticate, roundRoutes);
routes.use("/reset", resetRoutes);
routes.use("/stations", authenticate, stationRoutes);
routes.use("/teams", teamRoutes);
routes.use("/calibration_codes", codeRoutes);
routes.use("/reports", reportRoutes);

export default routes;
