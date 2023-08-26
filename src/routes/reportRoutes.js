import { Router } from "express";
import Station from "../models/station.js";
import CalibrationCode from "../models/calibrationCode.js";

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

// SET OWNER
reportRoutes.get("/:station/so", verifyPasskey, reportCom, setOwner);

// GET OWNER
reportRoutes.get("/:station/go", reportCom, getOwner);

// UNDER CAPTURE
reportRoutes.get("/:station/uc", reportCom, underCapture);

//GET TIME
// ! implement

//SET BOOST
// ! move here

// GET STATION BOOST
reportRoutes.get("/:station/gb", reportCom, getBoost);

// GET TIME TO START
reportRoutes.get("/:station/tts", reportCom, getTimeToStart);

// GET STATION TIME TO START
// ! implement

// VERIFY CALIBRATION CODE
// ! implement

//SUBMIT CALIBRATION CODE
// ! implement

// SET MISSION
// ! implement




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


reportRoutes.get("/:station/scc", async (req, res) => {
  try {
    const stations = await Station.find({});
    for (const station of stations) {
      station.under_capture = false;
      await station.save();
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

reportRoutes.get("/:station/vcc", async (req, res) => {
  try {
    const codes = await CalibrationCode.find({});
    for (const code of codes) {
      code.completed = false;
      await code.save();
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

//SET MISSION

reportRoutes.post('/set_mission', verifyPasskey, async (req, res) => {
  try {
   const mission = req.body.data.mission;

    console.log('stationId', mission.stationId);
    console.log('owner', mission.owner);
    console.log('code', mission.code);

    await CalibrationCode.disableOld(mission.owner);

    const newCode = new CalibrationCode({
      station_id: mission.stationId,
      owner: mission.owner,
      code: mission.code,
      completed: mission.completed || false,
    });

    await newCode.save();

    res.json({status: 'ok'});
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// SET BOOST
reportRoutes.post('/set_boost', verifyPasskey, async (req, res) => {
  // ! double check all of this
  try {
   let {station, boost} = req.body.data;
   console. log(station, boost);

  station = await Station.findOne( { bit_id: station } );
  console.log('station', station)

   if (!station) {
     return res.status(404).send("station not found\n");
   }
   if (boost >= 50 && boost <= 200 && station.boost !== boost) {
     station.boost = boost;
     await station.save();
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
