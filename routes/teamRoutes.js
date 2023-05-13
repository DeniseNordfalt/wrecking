import { Router } from "express";

import {
  getTeamList,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamEdit,
  teamReset,
} from "../controllers/teamsController.js";

const teamRoutes = Router();

//GET all teams
teamRoutes.get("/", getTeamList);

//GET team by id
teamRoutes.get("/:id", getTeamById);

//POST new team
teamRoutes.post("/", createTeam);

//PUT team by id
teamRoutes.put("/:id", updateTeam);

//PATCH team by id
teamRoutes.patch("/:id", updateTeam);

//DELETE team by id
teamRoutes.delete("/:id", deleteTeam);

//GET team edit page
teamRoutes.get("/:id/edit", getTeamEdit);

//Reset team score
teamRoutes.put("/:id/reset", teamReset);

export default teamRoutes;
