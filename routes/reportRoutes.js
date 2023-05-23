import { Router } from "express";
import Station from "../models/station.js";

import {
  getOwner,
  getTimeToStart,
  getBoost,
  setOwner,
  underCapture,
} from "../controllers/reportsController.js";

import verifyPasskey from "../middlewares/verifyPasskey.js";
import reportCom from "../middlewares/reportCom.js";

const reportRoutes = Router();

// Reports

// SET STATION OWNER
reportRoutes.get("/:station/so", verifyPasskey, reportCom, setOwner);

// GET STATION BOOST
reportRoutes.get("/:station/gb", reportCom, getBoost);

// GET OWNER
reportRoutes.get("/:station/go", reportCom, getOwner);

// GET TIME TO START
reportRoutes.get("/:station/tts", reportCom, getTimeToStart);

// UNDER CAPTURE
reportRoutes.get("/:station/uc", reportCom, underCapture);

/////////////////////////////////////////////////////////////

reportRoutes.get("/", (req, res) => {
  res.send("reports index");
});

// PUT /reports/:id/boost
reportRoutes.put("/:station/boost", async (req, res) => {
  try {
    const station = await Station.findById(req.params.station);
    console.log(station);
    if (!station) {
      res.status(404).send("station not found\n");
      return;
    }
    const boost = parseInt(req.body.boost);
    if (boost >= 50 && boost <= 200 && station.boost !== boost) {
      station.boost = boost;
      await station.save();
      console.log(`${station.boost} ${boost}`);
      res.sendStatus(202);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

export default reportRoutes;
