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


reportRoutes.get("/:station_id/vcc", async (req, res) => {

// const code = await CalibrationCode.findOne({
//   code: req.body.code,
//   station_id: req.body.station_id,
//   completed: false,
// }).exec();

// if (code) {
//   code.completed = true;
//   await code.save();

// } else {
//   //res.status(200).send("Ok:0");
// }


res.status(200).send("Ok:1");
});


//thirdgift routes

//set_boost
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

//set_mission
reportRoutes.post('/set_mission', verifyPasskey, async (req, res) => {
  try {
   const mission = req.body.data.mission;

   if (mission && typeof mission === 'object') {
    await CalibrationCode.disableOld(mission.owner);

    const newCode = new CalibrationCode({
      station_id: mission.stationId,
      owner: mission.owner,
      code: mission.code,
      completed: mission.completed || false,
    });

    await newCode.save();

    res.json({status: 'ok'});
  } else {
    res.status(422).json({status: 'error'});
  }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});




export default reportRoutes;
