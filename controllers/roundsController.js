const Round = require("./models/round"); // import Round model
const Station = require("./models/station"); // import Station model
const Thirdgift = require("./models/thirdgift"); // import Thirdgift model

const roundsController = {
  index: async (req, res) => {
    const rounds = await Round.find();
    const stations = await Station.find();
    res.render("rounds/index", { rounds, stations });
  },
  show: async (req, res) => {
    const round = await Round.findById(req.params.id);
    res.render("rounds/show", { round });
  },
  create: async (req, res) => {
    //const round = await Round.findOne().sort('-endtime'); // find the latest round
    const roundParams = req.body.round;
    const starttime = new Date(
      roundParams["starttime[1i]"],
      roundParams["starttime[2i]"] - 1,
      roundParams["starttime[3i]"],
      roundParams["starttime[4i]"],
      roundParams["starttime[5i]"]
    );
    starttime.setMinutes(
      starttime.getMinutes() - starttime.getTimezoneOffset()
    ); // adjust for timezone offset
    const runtime = parseInt(roundParams.length);
    const stations = maskStations(req.body.stations);

    await Round.create({
      name: "Test round",
      starttime,
      endtime: new Date(starttime.getTime() + runtime * 60000),
      active: false,
      stations,
    });

    thirdgiftUpdateRoundTime();

    res.redirect("/rounds");
  },
  edit: async (req, res) => {
    const round = await Round.findById(req.params.id);
    const stations = await Station.find().select("_id location").lean();
    stations.forEach((station) => {
      station.active = ((1 << (station._id - 1)) & round.stations) !== 0;
    });
    res.render("rounds/edit", { round, stations });
  },
  update: async (req, res) => {
    const stations = maskStations(req.body.stations);
    await Round.findByIdAndUpdate(
      req.params.id,
      { $set: { ...req.body.round, stations } },
      { runValidators: true }
    );

    thirdgiftUpdateRoundTime();

    res.redirect(`/rounds/${req.params.id}`);
  },
  destroy: async (req, res) => {
    await Round.findByIdAndDelete(req.params.id);

    thirdgiftUpdateRoundTime();

    res.redirect("/rounds");
  },
};

function maskStations(stationsFromParams) {
  let stations = 0;
  for (let station of stationsFromParams) {
    const id = parseInt(station);
    stations |= 1 << (id - 1);
  }
  return stations;
}

function thirdgiftUpdateRoundTime() {
  Thirdgift.updateRoundTime();
}

module.exports = roundsController;
