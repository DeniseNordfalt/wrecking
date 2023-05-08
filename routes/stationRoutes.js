import { Router } from "express";
import { getStations } from "../controllers/stationsController.js";
import Station from "../models/station.js";

const stationRoutes = Router();

// Stations
/*stationRoutes.get("/", (req, res) => {
  const baseUrl = req.baseUrl;
  const routes = stationRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  const links = routes
    .map((route) => `<li><a href="${baseUrl}${route}">${route}</a></li>`)
    .join("");
  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
})
*/

// GET stations
stationRoutes.get("/", getStations);

//GET stations/remaining
stationRoutes.get("/remaining", (req, res) => {
  // TODO: check logic for stations remaining

  const time_left = 12345678901234567890n;
  res.set("Content-Length", time_left);
  res.status(200).send();

  //res.send("stations remaining");
});

//GET stations/:id
stationRoutes.get("/:id", async (req, res) => {
  /* ... */
  const id = req.params.id;
  try {
    const station = await Station.findById(id);
    res.send(station);
  } catch (error) {
    res.status(404).send("Station not found");
  }
  //const station = await Station.findById(id);

  //res.render("stations/show", { station: station });
  //res.send(station);
});

// GET stations/:id/edit
stationRoutes.get("/:id/edit", async (req, res) => {
  const id = req.params.id;
  const station = await Station.findById(id);
  //res.render("stations/edit", { station: station });
  res.send(station);

  //TODO: add try/catch
});

//PATCH stations/:id
stationRoutes.patch("/:id", async (req, res) => {
  const id = req.params.id;
  //const { location, team, boost, reward } = req.body;
  const { location, team, boost, reward, under_capture } = await req.body;
  const station = await Station.findById(id);
  station.location = location;
  station.team = team;
  station.boost = boost;
  station.reward = reward;
  station.under_capture = under_capture;

  await station.save();

  res.send(station);

  //TODO: add try/catch, make sure not crash if not all values
});

//PUT stations/:id
stationRoutes.put("/:id", async (req, res) => {
  const id = req.params.id;
  const { location, team, boost, reward, under_capture } = await req.body;
  const station = await Station.findById(id);
  station.location = location;
  station.team = team;
  station.boost = boost;
  station.reward = reward;
  station.under_capture = under_capture;

  await station.save();

  res.send(station);

  //TODO: add try/catch
});

// PUT stations/:id/reset
stationRoutes.put("/:id/reset", async (req, res) => {
  /* ... */
  const id = req.params.id;
  const station = await Station.findById(id);
  station.team = null;
  station.boost = 100;
  station.under_capture = false;
  station.reward = 100;

  await station.save();

  res.send(station);
});

export default stationRoutes;
