import Station from "../models/station.js";
import mongoose from "mongoose";

const getStations = async (req, res) => {
  try {
    const stations = await Station.find();

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
      station = await Station.findOne({ bit_id: id });
    } else if (mongoose.isValidObjectId(id)) {
      station = await Station.findById(id);
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
    res.status(200).send({ station: station });
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

  if (!station) {
    res.status(404).send("Station not found");
    return;
  }

  try {
    res.render("stations/edit", { station });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error" + error);
  }
};

////////////////////////////////////////////////////////

// middleware functions

//TODO: Implement the following middleware functions
const setStation = async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) {
      return res.status(404).send("Station not found");
    }
    req.station = station;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
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

  //TODO: FIX THIS
  /*let station;
  if (mongoose.isValidObjectId(id)) {
    station = await Station.findById(id);
  }
  station.team = null;
  station.boost = 100;
  station.under_capture = false;
  station.reward = 100;

  await station.save();

  res.send(station);*/
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
