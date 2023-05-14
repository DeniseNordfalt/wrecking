import Round from "../models/round.js";
import Station from "../models/station.js";

const getRounds = async (req, res) => {
  try {
    const rounds = await Round.find();

    res.format({
      "text/html": () => {
        res.render("rounds/index", { rounds: rounds });
      },
      "application/json": () => {
        res.send({ rounds: rounds });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(404).send("Round not found");
  }
};

const getRoundById = async (req, res) => {
  const id = req.params.id;

  try {
    const round = await Round.findById(id);
    res.send(round);
  } catch (error) {
    res.status(404).send("Round not found");
  }
};

const createRound = async (req, res) => {
  const round = new Round(req.body);
  try {
    await round.save();
    res.send(round);
  } catch (error) {
    res.status(404).send("Round could not be created" + error);
  }
};

const updateRound = async (req, res) => {
  const id = req.params.id;
  const { name, starttime, endtime } = req.body;

  try {
    const round = await Round.findById(id);
    if (name) {
      round.name = name;
    }
    if (starttime) {
      round.starttime = starttime;
    }
    if (endtime) {
      round.endtime = endtime;
    }
    await round.save();
    res.send(round);
  } catch (error) {
    res.status(404).send("Round could not be updated");
  }
};

const deleteRound = async (req, res) => {
  const id = req.params.id;

  try {
    const round = await Round.findByIdAndDelete(id);

    res.send(round + " deleted successfully");
  } catch (error) {
    res.status(404).send("Round could not be deleted");
  }
};

export { getRounds, getRoundById, createRound, updateRound, deleteRound };
