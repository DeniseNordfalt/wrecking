import { Router } from "express";

import {
  getStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
  editStation,
  resetStation,
} from "../controllers/stationsController.js";

/*
Stations Controller:

* GET /stations - Index action (listing stations)
* GET /stations/:id - Show action (showing a specific station)
* GET /stations/:id/edit - Edit action (edit a specific station)
* PUT /stations/:id - Update action (update a specific station)
! GET /stations/remaining - Custom collection action for stations
! PUT /stations/:id/reset - Custom member action for resetting a specific station

*/





const stationRoutes = Router();

// GET stations
stationRoutes.get("/", getStations);

//GET stations/:id
stationRoutes.get("/:id", getStationById);

//POST stations
stationRoutes.post("/", createStation);

//PATCH stations/:id
stationRoutes.patch("/:id", updateStation);

//PUT stations/:id
stationRoutes.put("/:id", updateStation);

//DELETE stations/:id
stationRoutes.delete("/:id", deleteStation);

// GET stations/:id/edit
stationRoutes.get("/:id/edit", editStation);

// PUT stations/:id/reset
stationRoutes.put("/:id/reset", resetStation);

// TODO: 
// GET stations/remaining

export default stationRoutes;
