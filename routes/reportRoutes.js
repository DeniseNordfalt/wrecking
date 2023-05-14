import { Router } from "express";
import Station from "../models/station.js";
import Team from "../models/team.js";
import Round from "../models/round.js";
import CalibrationCode from "../models/calibration_code.js";
import mongoose from "mongoose";

import {
  getOwner,
  getTimeToStart,
  getBoost,
  setOwner,
  underCapture,
} from "../controllers/reportsController.js";

import verifyPasskey from "../middlewares/verifyPasskey.js";

const reportRoutes = Router();

//RUBY CODE
// skip_before_filter  :verify_authenticity_token
// before_action :verify_passkey, only: [:set_owner, :set_boost, :verify_calibration_code, :submit_calibration_code, :set_mission]
// after_action :report_com, only: [:get_boost, :set_owner, :get_station_time_to_start]

// Reports

/*
reportRoutes.get("/", (req, res) => {
  const baseUrl = req.baseUrl;
  const routes = reportRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  const links = routes
    .map((route) => `<li><a href="${baseUrl}${route}">${route}</a></li>`)
    .join("");
  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
});
*/

// SET STATION OWNER
reportRoutes.get("/:station/so", verifyPasskey, setOwner);

// GET STATION BOOST
reportRoutes.get("/:station/gb", getBoost);

// GET OWNER
reportRoutes.get("/:id/go", getOwner);

// GET TIME TO START
reportRoutes.get("/:station/tts", getTimeToStart);

// UNDER CAPTURE
reportRoutes.get("/:station/uc", underCapture);

// reportRoutes.get("/:station/boost", async (req, res) => {

/////////////////////////////////////////////////////////////

// GET /reports

reportRoutes.get("/", (req, res) => {
  /* ... */
  res.send("reports index");
});

// GET /reports/:id/get_owner
// reportRoutes.get("/:id/get_owner", async (req, res) => {
//   try {
//     const station = await Station.findById(req.params.id);
//     if (station) {
//       //if (station.team && station.team_id >= 1 && station.team_id <= 4) {
//       if (station.team && station.team._id) {
//         //res.status(200).send(`Ok:${station.team_id}`);
//         res.status(200).send(`Ok:${station.team._id}`);
//         console.log(station.owner);
//       } else {
//         res.status(200).send("Ok:0");
//       }
//     } else {
//       res.status(404).send("Station not found");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// });

//PUT /reports/:id/set_owner
reportRoutes.put("/:id/set_owner", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);

    let owner;
    if (req.query.owner === "0") {
      owner = null;
    } else {
      owner = req.query.owner;
    }

    if (
      (req.query.owner === "0" || (await Team.exists({ _id: owner }))) &&
      (await station.updateOne({ team: owner, under_capture: false }))
    ) {
      if (owner !== null || owner !== undefined) {
        const team = await Team.findById(owner);
        await team.check_capture_bonus(station.id);
      }
      //await Thirdgift.set_station_owner(req.params.id, owner);
      res.status(202).send("Ok");
    } else {
      res.status(400).end();
    }
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

// PUT /reports/:id/under_capture
reportRoutes.put("/:id/under_capture", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (station) {
      station.under_capture = true;
      await station.save();
      //await Thirdgift.under_capture(req.params.id);
      res.status(202).send("Ok");
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// GET /reports/time
reportRoutes.get("/time", (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  res.set("Content-Type", "text/plain");
  res.status(200).send(timestamp.toString());
});

// PUT /reports/:id/boost
// reportRoutes.put("/:id/boost", async (req, res) => {
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

// GET /reports/round/get_time_to_start
reportRoutes.get("/round/get_time_to_start", async (req, res) => {
  const rounds = await Round.find({}).exec();
  const activeRounds = rounds.filter((round) => round.active);
  const comingRounds = rounds.filter((round) => !round.active);

  if (activeRounds.length > 0) {
    const round = activeRounds[0];
    const time = round.starttime - Math.floor(Date.now() / 1000);
    res.status(200).send(`Ok:${time}`);
  } else if (comingRounds.length > 0) {
    const round = comingRounds[0];
    const time = round.starttime - Math.floor(Date.now() / 1000);
    res.status(200).send(`Ok:${time}`);
  } else {
    res.status(404).send("Ok:999999");
  }

  // console.log("round active", activeRounds);
  // console.log("round coming", comingRounds);
  // res.send({ activeRounds, comingRounds });
});

// GET /reports/:station/round/get_station_time_to_start
// reportRoutes.get(
//   "/:station/round/get_station_time_to_start",
//   async (req, res) => {

//POST /reports/:station/verify_calibration_code
reportRoutes.post("/:station/verify_calibration_code", async (req, res) => {
  try {
    const code = await CalibrationCode.findOne({
      //code: req.params.code,
      code: req.body.code,
      //station_id: req.params.id,
      stationId: req.params.station,
      completed: false,
    });

    if (!code) {
      return res.status(200).send("Ok:0");
    }

    //const api_status = await Thirdgift.submit_calibration_code(code);

    //if (api_status) {
    if (code && code.stationId == req.params.station) {
      await code.updateOne({ completed: true });
      return res.status(200).send("Ok:1");
    } else {
      return res.status(200).send("Ok:0");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

//POST /reports/set_mission
// receive generate calibration codes from thirdgift
reportRoutes.post("/set_mission", async (req, res) => {
  //TODO: update this with Thirdgift

  try {
    const { mission } = req.body;
    console.log(mission);

    //await CalibrationCode.disable_old(mission.owner);

    const code = new CalibrationCode({
      owner: mission.owner,
      code: mission.code,
      stationId: mission.stationId,
      completed: mission.completed || false,
    });

    await code.save();

    res.json({ status: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// possible routes

reportRoutes.get("/get_time_to_start", (req, res) => {
  /* ... */
  res.send("reports get_time_to_start");
});
reportRoutes.get("/tts", (req, res) => {
  /* ... */
  res.send("reports tts");
});
reportRoutes.get("/get_time", (req, res) => {
  /* ... */
  res.send("reports get_time");
});
reportRoutes.get("/time?", (req, res) => {
  /* ... */
  res.send("reports time?");
});
reportRoutes.post("/set_boost", (req, res) => {
  /* ... */
  res.send("reports set_boost");
});
reportRoutes.post("/set_mission", (req, res) => {
  /* ... */
  res.send("reports set_mission");
});

reportRoutes.get("/:id/so", (req, res) => {
  /* ... */

  res.send("reports so");
});
reportRoutes.get("/:id/get_owner", (req, res) => {
  /* ... */

  res.send("reports get_owner");
});
reportRoutes.get("/:id/go", (req, res) => {
  /* ... */

  res.send("reports go");
});
reportRoutes.get("/:id/battery_level", (req, res) => {
  /* ... */

  res.send("reports battery_level");
});
reportRoutes.get("/:id/bl", (req, res) => {
  /* ... */

  res.send("reports bl");
});
reportRoutes.get("/:id/under_capture", (req, res) => {
  /* ... */

  res.send("reports under_capture");
});
reportRoutes.get("/:id/uc", (req, res) => {
  /* ... */

  res.send("reports uc");
});
reportRoutes.get("/:id/get_boost", (req, res) => {
  /* ... */

  res.send("reports get_boost");
});
reportRoutes.get("/:id/gb", (req, res) => {
  /* ... */

  res.send("reports gb");
});
reportRoutes.get("/:id/get_time_to_start", (req, res) => {
  /* ... */

  res.send("reports get_time_to_start");
});
reportRoutes.get("/:id/tts", (req, res) => {
  /* ... */

  res.send("reports tts");
});
reportRoutes.get("/:id/submit_calibration_code", (req, res) => {
  /* ... */

  res.send("reports submit_calibration_code");
});
reportRoutes.get("/:id/scc", (req, res) => {
  /* ... */

  res.send("reports scc");
});
reportRoutes.get("/:id/verify_calibration_code", (req, res) => {
  /* ... */

  res.send("reports verify_calibration_code");
});
reportRoutes.get("/:id/vcc", (req, res) => {
  /* ... */

  res.send("reports vcc");
});

export default reportRoutes;
