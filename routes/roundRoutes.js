import { Router } from "express";
import Round from "../models/round.js";

const roundRoutes = Router();

// Rounds
/*
roundRoutes.get("/", (req, res) => {

  const baseUrl = req.baseUrl;
  const routes = roundRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  const links = routes
    .map((route) => `<li><a href="${baseUrl}${route}">${route}</a></li>`)
    .join("");
  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
});
*/

// GET /rounds
roundRoutes.get("/", async (req, res) => {
  const rounds = await Round.find();
  res.send(rounds);
  //res.render("rounds/index", { rounds: rounds });
});

//GET /rounds/new
roundRoutes.get("/new", async (req, res) => {
  res.send("rounds new");
});

//GET /rounds/:id/
roundRoutes.get("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;

  try {
    const round = await Round.findById(id);
    res.send(round);
  } catch (error) {
    res.status(404).send("Round not found");
  }
});

//POST /rounds
roundRoutes.post("/", async (req, res) => {
  // const { name, starttime, endtime } = req.body;
  //TODO: update
  // const { name, starttime, endtime } = req.body;
  // const round = new Round({ name, starttime, endtime });
  const round = new Round(req.body);
  try {
    await round.save();
    res.send(round);
  } catch (error) {
    res.status(404).send("Round could not be created" + error);
  }
});

//GET /rounds/:id/edit
roundRoutes.get("/:id/edit", async (req, res) => {
  /* ... */
  const id = req.params.id;

  try {
    const round = await Round.findById(id);
    res.send(round);
  } catch (error) {
    res.status(404).send("Round not found");
  }
});

//PUT /rounds/:id
roundRoutes.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, starttime, endtime } = req.body;

  try {
    const round = Round.findById(id);
    round.name = name;
    round.starttime = starttime;
    round.endtime = endtime;
    await round.save();
    res.send(round);
  } catch (error) {
    res.status(404).send("Round could not be updated");
  }
});

// PATCH /rounds/:id
roundRoutes.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const { name, starttime, endtime } = req.body;

  try {
    const round = await Round.findById(id);
    if (name) {
      round.name = name;
    }
    if (starttime) {
      round.starttime = starttime;
    }
    if (endtime) {
      round.endtime = endtime;
    }
    await round.save();
    res.send(round);
  } catch (error) {
    res.status(404).send("Round could not be updated");
  }
});

//DELETE /rounds/:id
roundRoutes.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const round = await Round.findByIdAndDelete(id);

    res.send(round + " deleted successfully");
  } catch (error) {
    res.status(404).send("Round could not be deleted");
  }
});

export default roundRoutes;
