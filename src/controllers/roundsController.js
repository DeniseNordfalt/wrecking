import Round from "../models/round.js";
import Station from "../models/station.js";

//BEFORE ACTION (SET ROUND) Round.find(params[id])
//Before ^^^ only show, edit, update, destroy
//AFTER ACTION (thirdgift_update_time) 
/*
 def thirdgift_update_time
      Thirdgift.update_round_time

    end
*/
//AFTER ^^^ only create, update, destroy
// BEFORE ACTION authenticate_user

//INDEX (GET /rounds & /rounds.json)
// ! implement

//SHOW (GET /rounds/:id & /rounds/:id.json)
// ! implement

//CREATE (POST /rounds & /rounds.json)
// ! implement

//NEW_OLD (GET /rounds/new & /rounds/new.json)
// ! implement

//EDIT (GET /rounds/:id/edit & /rounds/:id/edit.json)
// ! implement

//CREATE_OLD (POST /rounds & /rounds.json)
// ! implement

//UPDATE (PATCH/PUT /rounds/:id & /rounds/:id.json)
// ! implement

//DESTROY (DELETE /rounds/:id & /rounds/:id.json)
// ! implement

// private MASK_STATIONS ???
// private SET_ROUND
// private ROUND_PARAMS
// private THIRDGIFT_UPDATE_TIME

const getRounds = async (req, res) => {
  try {
    const rounds = await Round.find();
    const stations = await Station.find();

    res.format({
      "text/html": () => {
        res.render("rounds/index", { rounds: rounds, stations: stations });
      },
      "application/json": () => {
        res.send({ rounds: rounds, stations: stations });
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
    const stations = await Station.find();

    res.format({
      "text/html": () => {
        res.render("rounds/show", { round: round, stations: stations });
      },
      "application/json": () => {
        res.send({ round: round, stations: stations });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(404).send("Round not found");
  }
};

const createRound = async (req, res) => {
  const { starttime, endtime, name } = req.body;
  try {
    const round = new Round({
      starttime: starttime,
      endtime: endtime,
      name: name,
    });

    await round.save();
    res.redirect("/rounds");
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
    res.format({
      "text/html": () => {
        res.redirect(`/rounds/${round._id}`);
      },
      "application/json": () => {
        res.send({ round: round });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
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
