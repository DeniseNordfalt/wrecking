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

const stationRoutes = Router();

// GET stations
stationRoutes.get("/", getStations);


//GET stations/:id
stationRoutes.get("/:id", getStationById);

// PUT stations/:id/reset
stationRoutes.put("/:id/reset", resetStation);







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



export default stationRoutes;
