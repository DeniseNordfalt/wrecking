import Team from "../models/team.js";

const getTeamList = async (req, res) => {
  try {
    const teams = await Team.find();
    res.format({
      "text/html": () => {
        res.render("teams/index", { teams: teams });
      },
      "application/json": () => {
        res.status(200).send(teams);
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(404).send("Not found");
  }
};

const getTeamById = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Team.findById(id);
    res.format({
      "text/html": () => {
        res.render("teams/show", { team: team });
      },
      "application/json": () => {
        res.status(200).send({ team: team });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(404).send("Team not found");
  }
};

const createTeam = async (req, res) => {
  const { name, colour, shortName } = req.body;
  const team = new Team({ name, colour, shortName });
  try {
    const existingTeams = await Team.find();
    if (existingTeams.length >= 4) {
      res.status(400).send("Team could not be created, max 4 teams");
    } else {
      await team.save();
      res.send({ team: team });
    }
  } catch (error) {
    res.status(404).send("Team could not be created");
  }
};

const updateTeam = async (req, res) => {
  try {
    //TODO: change to bit_id or change id to numbers
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).send("Team not found");
    }
    const { name, colour, shortName } = req.body;
    if (name) {
      team.name = name;
    }
    if (colour) {
      team.colour = colour;
    }
    if (shortName) {
      team.shortName = shortName;
    }
    await team.save();
    await res.send(team);
  } catch (error) {
    res.status(400).send("Team could not be updated" + error);
  }
};

const deleteTeam = async (req, res) => {
  //TODO: change to bit_id or change id to numbers
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) {
      return res.status(404).send("Team not found");
    }

    res.status(200).send("Team deleted - " + team.name);
  } catch (error) {
    res.status(400).send("Team could not be deleted");
  }
};

const getTeamEdit = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Team.findById(id);
    res.render("teams/edit", { team: team });
  } catch (error) {
    res.status(404).send("Team not found");
  }
};

const teamReset = async (req, res) => {
  const id = req.params.id;
  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).send("Team not found");
    }
    team.score = 0;
    await team.save();
    res.status(200).send("Team reset");
  } catch (error) {
    res.status(400).send("Team could not be reset");
  }
};

export {
  getTeamList,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamEdit,
  teamReset,
};
