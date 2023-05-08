import { Router } from "express";
import Team from "../models/team.js";

const teamRoutes = Router();

// Teams
/* teamRoutes.get("/", (req, res) => {

  const baseUrl = req.baseUrl;
  const routes = teamRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  const links = routes
    .map((route) => `<li><a href="${baseUrl}${route}">${route}</a></li>`)
    .join("");
  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
});*/

teamRoutes.get("/", async (req, res) => {
  const json = req.query.json;

  const teams = await Team.find();

  if (json) {
    res.send(teams);
  } else {
    res.render("teams/index", { teams: teams });
  }
});

teamRoutes.get("/new", async (req, res) => {
  // const { name, colour, shortName } = req.body;
  // const team = new Team({ name, colour, shortName });
  // try {
  //   await team.save();
  //   res.send(team);
  // } catch (error) {
  //   res.status(404).send("Team could not be created");
  // }
  res.send("teams new");
  // TODO: is this necessary?
});

teamRoutes.get("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;
  const json = req.query.json;

  try {
    const team = await Team.findById(id);
    if (json === "true") {
      res.send(team);
    } else {
      res.render("teams/show", { team: team });
    }
  } catch (error) {
    res.status(404).send("Team not found");
  }
});

teamRoutes.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const json = req.query.json;

  try {
    const team = await Team.findById(id);
    if (json === "true") {
      res.send(team);
    } else {
      res.render("teams/edit", { team: team });
    }
  } catch (error) {
    res.status(404).send("Team not found");
  }
});

teamRoutes.post("/", async (req, res) => {
  const { name, colour, shortName } = req.body;
  const team = new Team({ name, colour, shortName });
  try {
    const existingTeams = await Team.find();
    if (existingTeams.length >= 4) {
      res.status(404).send("Team could not be created, max 4 teams");
    } else {
      await team.save();
      res.send(team);
    }
  } catch (error) {
    res.status(404).send("Team could not be created");
  }
});

teamRoutes.put("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;
  const { name, colour, shortName } = req.body;

  try {
    const team = await Team.findById(id);
    team.name = name;
    team.colour = colour;
    team.shortName = shortName;
    await team.save();
    res.send(team);
  } catch (error) {
    res.status(404).send("Team could not be updated");
  }
});

teamRoutes.patch("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;
  const { name, colour, shortName } = req.body;

  try {
    const team = await Team.findById(id);
    if (name) {
      team.name = name;
    }
    if (colour) {
      team.colour = colour;
    }
    if (shortName) {
      team.shortName = shortName;
    }
    await team.save();
    res.send(team);
  } catch (error) {
    res.status(404).send("Team not found");
  }

  //TODO: Add logic for patch
});

teamRoutes.delete("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;

  try {
    const team = await Team.findByIdAndDelete(id);
    // await team.remove();
    res.send(team + " deleted");
  } catch (error) {
    res.status(404).send("Could not delete team");
  }
});

teamRoutes.put("/:id/reset", async (req, res) => {
  /* ... */
  const id = req.params.id;

  try {
    const team = await Team.findById(id);
    team.score = 0;
    await team.save();
    res.send(team);
  } catch (error) {
    res.status(404).send("Team not found");
  }
});

export default teamRoutes;
