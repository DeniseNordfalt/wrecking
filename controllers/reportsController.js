import Station from "../models/station.js";
import Team from "../models/team.js";
import Round from "../models/round.js";
import mongoose from "mongoose";

const getOwner = async (req, res) => {
  try {
    const id = req.params.station;
    let station;

    //find the right station
    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
    }

    if (station) {
      //check team
      if (station.team) {
        const team = await Team.findById(station.team);
        if (team) {
          return res.status(200).send(`Ok:${team.team_id}`);
        }
      } else {
        return res.status(200).send(`Ok:0`);
      }
    } else {
      res.status(404).send("Station not found");
    }

    res.status(200).send(`Ok:${station.owner}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// const setOwner = async (req, res) => {
//   try {
//     const id = req.params.station;
//     let station;
//     //let key = req.query.key;
//     let owner = req.query.owner;

//     //DEBUG TO  HANDLE ; IN KEY
//     //TODO: REMOVE ; in querystring in arduino
//     const inputString = req.query.key;
//     const pairs = inputString.split(";");
//     //key = pairs[0];
//     const ownerPair = pairs[1].split("=");
//     const checkNumber = parseInt(ownerPair[1]);
//     if (isNaN(checkNumber) === false && checkNumber >= 1 && checkNumber <= 4) {
//       owner = ownerPair[1];
//     } else {
//       res.status(400).send("Bad request");
//       return;
//     }
//     //DEBUG ENDS HERE

//     //find the right station
//     if (parseInt(id) >= 1 && parseInt(id) <= 4) {
//       station = await Station.findOne({ bit_id: id });
//     } else {
//       res.status(404).send("Station not found");
//       return;
//     }
//     console.log(station);

//     if (owner) {
//       const team = await Team.findOne({ team_id: owner });
//       const allTeams = await Team.find({});

//       console.log('OWNER', owner);

//       for (const team of allTeams) {
//         await team.remove_station(station);
//       }

//       station.team = team._id;
//       station.under_capture = false;
//       station.owner = owner;

//       await station.save();

//       team.stations.push(station._id);
//       await team.check_capture_bonus(station.bit_id);
//       await team.save();

//       res.status(202).send(`Ok`);
//     } else {
//       station.team = null;
//       station.under_capture = false;
//       station.owner = null;
//       await station.save();

//       res.status(202).send(`Ok`);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Server error");
//   }
// };

const setOwner = async (req, res) => {
  try {
    const id = req.params.station;
    let station;
    //let key = req.query.key;
    let owner = req.query.owner;

    //DEBUG TO  HANDLE ; IN KEY
    //TODO: REMOVE ; in querystring in arduino
    const inputString = req.query.key;
    const pairs = inputString.split(";");
    //key = pairs[0];
    const ownerPair = pairs[1].split("=");
    const checkNumber = parseInt(ownerPair[1]);
    if (isNaN(checkNumber) === false && checkNumber >= 0 && checkNumber <= 4) {
      owner = ownerPair[1];
    } else {
      res.status(400).send("Bad request");
      return;
    }
    //DEBUG ENDS HERE

    //find the right station
    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
    } else {
      res.status(404).send("Station not found");
      return;
    }

    //set owner as null if 0
    if (owner === "0") {
      owner = null;
    }
    else{
      owner = parseInt(owner);
    }

    // console.log('owner', owner);
    
    // res.status(202).send(`Ok`);


  
    if (owner) {
      const team = await Team.findOne({ team_id: owner });
      const allTeams = await Team.find({});

      for (const team of allTeams) {
        await team.remove_station(station);
      }

      station.team = team._id;
      station.under_capture = false;
      station.owner = owner;

      await station.save();

       team.stations.push(station._id);
      await team.check_capture_bonus(station.bit_id);
      await team.save();

      res.status(202).send(`Ok`);
    } else {
      station.team = null;
      station.under_capture = false;
      station.owner = null;
      await station.save();

      res.status(202).send(`Ok`);
    }
  
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const getBoost = async (req, res) => {
  try {
    const id = req.params.station;
    console.log(id);
    //const station = await Station.findById(id);
    const station = await Station.findOne({ bit_id: id });

    if (!station) {
      return res.status(404).send("Station not found");
    }

    res.status(200).send(`Ok:${station.boost}`);
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

const getTimeToStart = async (req, res) => {
  try {
    const id = req.params.station;
    let station;

    //find the right station
    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
    }

    if (!station) {
      res.status(404).send("Station not found");
      return;
    }

    let activeRounds = [];
    const active = await Round.active().countDocuments();
    if (active > 0) {
      activeRounds = await Round.active();

      const activeRoundsFiltered = activeRounds.filter(
        (x) =>
          ((1 << (station.bit_id - 1)) & x.stations) ===
          1 << (station.bit_id - 1)
      );
      if (activeRoundsFiltered.length > 0) {
        console.log(activeRoundsFiltered[0].seconds_left());
        return res
          .status(200)
          .send(`Ok:${-activeRoundsFiltered[0].seconds_left()}`);
      }
    }

    let comingRounds = [];
    const coming = await Round.coming().countDocuments();
    if (coming > 0) {
      comingRounds = await Round.coming();

      const comingRoundsFiltered = comingRounds.filter(
        (x) =>
          ((1 << (station.bit_id - 1)) & x.stations) ===
          1 << (station.bit_id - 1)
      );
      if (comingRoundsFiltered.length > 0) {
        const timeToStart =
          Math.floor((comingRoundsFiltered[0].starttime - Date.now()) / 1000) +
          1;
        return res.status(200).send(`Ok:${timeToStart}`);
      }
    }

    return res.status(200).send("Ok:999999");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

const underCapture = async (req, res) => {
  try {
    const id = req.params.station;
    let station;

    //find the right station and set under capture
    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
    }

    if (station) {
      station.under_capture = true;
      await station.save();
      return res.status(202).send("Ok");
    } else {
      return res.status(400).send("Station not found");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
};

export { getOwner, setOwner, getBoost, getTimeToStart, underCapture };
