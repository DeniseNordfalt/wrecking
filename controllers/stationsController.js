import { Router } from "express";
const router = Router();
import Station from "../models/station.js";

// middleware functions
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

const authenticateUser = (req, res, next) => {
  // Implement authentication logic here
  next();
};

// Define the stations controller
// router.get('/stations', async (req, res) => {
//     try {
//       const stations = await Station.find();
//       res.render('stations/index', { stations });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal server error');
//     }
//   });

const getStations = async (req, res) => {
  const json = req.query.json;
  try {
    //const stations = await Station.find();
    const stations = await Station.find();
    //res.render("stations/index", { stations });
    if (json) {
      res.send(stations);
    } else {
      res.render("stations/index", { stations: stations });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// router.get("/stations/:id", setStation, (req, res) => {
//   res.render("stations/show", { station: req.station });
// });

const getStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    //res.render("stations/show", { station });
    res.send(station);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

router.get("/stations/new", (req, res) => {
  res.render("stations/new");
});

// router.post("/stations", async (req, res) => {
//   try {
//     const station = new Station(req.body);
//     await station.save();
//     res.redirect(`/stations/${station.id}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

const createStation = async (req, res) => {
  try {
    const station = new Station(req.body);
    await station.save();
    res.redirect(`/stations/${station.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// router.get("/stations/:id/edit", setStation, (req, res) => {
//   res.render("stations/edit", { station: req.station });
// });

const editStation = async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    res.render("stations/edit", { station });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// router.patch("/stations/:id", setStation, async (req, res) => {
//   try {
//     await req.station.updateOne(req.body);
//     res.redirect("/stations");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

const updateStation = async (req, res) => {
  try {
    await req.station.updateOne(req.body);
    res.redirect("/stations");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

// router.delete("/stations/:id", setStation, async (req, res) => {
//   try {
//     await req.station.deleteOne();
//     res.redirect("/stations");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal server error");
//   }
// });

const deleteStation = async (req, res) => {
  // TODO: Implement delete station logic here, id, setStation?
  try {
    await req.station.deleteOne();
    res.redirect("/stations");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

export {
  getStations,
  getStation,
  createStation,
  editStation,
  updateStation,
  deleteStation,
  authenticateUser,
  setStation,
};
