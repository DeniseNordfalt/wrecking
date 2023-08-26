import Station from "../models/station.js";
import Team from "../models/team.js";
import mongoose from "mongoose";

//INDEX
// ! implement

//SHOW
// ! implement

//OWNERSHIP
// ! implement

//RESET
// ! implement

//REMAINING
// ! implement

//NEW
// ! implement

//EDIT
// ! implement

//CREATE
// ! implement

//UPDATE
// ! implement

//DESTROY
// ! implement

//private SET_STATION
//private STATION_PARAMS



const getStations = async (req, res) => {
  try {
    const stations = await Station.find().populate("team");

    res.format({
      "text/html"() {
        res.render("stations/index", { stations: stations });
      },
      "application/json"() {
        res.send(stations);
      },
      default() {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(500).send("Internal server error" + error);
  }
};

const getStationById = async (req, res) => {
  const id = req.params.id;

  try {
    let station;

    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id }).populate("team");
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id).populate("team");
    }

    if (!station) {
      res.status(404).send("Station not found");
      return;
    }

    res.format({
      "text/html"() {
        res.render("stations/show", { station: station });
      },
      "application/json"() {
        res.send(station);
      },
      default() {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(500).send("Internal server error" + error);
  }
};

const createStation = async (req, res) => {
  try {
    const { location, boost } = req.body;
    const existingStationsCount = await Station.countDocuments();
    console.log(existingStationsCount);
    if (existingStationsCount >= 4) {
      res.status(400).send("Maximum station limit reached");
    } else {
      const bit_id = existingStationsCount + 1;
      const station = await Station.create({ bit_id, location, boost });
      res.status(201).json(station);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const updateStation = async (req, res) => {
  const id = req.params.id;
  try {
    let station;

    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
    }

    if (!station) {
      res.status(404).send("Station not found");
      return;
    }
    const { location, team, boost, reward, under_capture } = await req.body;

    if (location) {
      station.location = location;
    }
    if (team) {
      station.team = team;
      const owner = await Team.findById(team);
      station.owner = owner.team_id;

      owner.captured_stations.push(station.bit_id);
      owner.stations.push(station._id);

      await owner.save();
    }
    if (boost) {
      station.boost = boost;
    }
    if (reward) {
      station.reward = reward;
    }
    if (under_capture) {
      station.under_capture = under_capture;
    }

    await station.save();
    // res.status(200).send({ station: station });
    res.format({
      "text/html"() {
        res.redirect(`/stations/${station._id}`);
      },
      "application/json"() {
        res.send({ station: station });
      },
      default() {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const deleteStation = async (req, res) => {
  const id = req.params.id;
  console.log(id);

  let station;
  try {
    if (parseInt(id) >= 1 && parseInt(id) <= 4) {
      station = await Station.findOne({ bit_id: id });
      await station.findOneAndDelete({ bit_id: id });
      res.status(200).send("Station deleted successfully");
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
      await station.findByIdAndDelete(id);
      res.status(200).send("Station deleted successfully");
    }

    if (!station) {
      res.status(404).send("Station not found");
      return;
    }

    res.status(200).send("Station deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

const editStation = async (req, res) => {
  const id = req.params.id;
  let station;

  if (parseInt(id) >= 1 && parseInt(id) <= 4) {
    station = await Station.findOne({ bit_id: id });
  } else if (mongoose.isValidObjectId(id)) {
    station = await Station.findById(id);
  }

  const teams = await Team.find();

  if (!station) {
    res.status(404).send("Station not found");
    return;
  }

  try {
    res.render("stations/edit", { station, teams });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error" + error);
  }
};

const resetStation = async (req, res) => {
  const id = req.params.id;
  let station;

  if (parseInt(id) >= 1 && parseInt(id) <= 4) {
    station = await Station.findOne({ bit_id: id });
    res.send(station);
  }

  if (mongoose.isValidObjectId(id)) {
    station = await Station.findById(id);
    res.send(station);
  }
  if (!station) {
    res.status(404).send("Station not found");
    return;
  }
};

export {
  getStations,
  getStationById,
  createStation,
  editStation,
  updateStation,
  deleteStation,
  resetStation,
};
