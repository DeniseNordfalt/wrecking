import { Router } from "express";

import {
  getTeamList,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getTeamEdit,
  resetTeam,
} from "../controllers/teamsController.js";

const teamRoutes = Router();

/* 
Teams Controller:

* GET /teams - Index action (listing teams)
* GET /teams/:id - Show action (showing a specific team)
* GET /teams/:id/edit - Edit action (edit a specific team)
* PUT /teams/:id - Update action (update a specific team)
! PUT /teams/:id/reset - Custom member action for resetting a specific team
*/

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
teamRoutes.put("/:id/reset", resetTeam);

export default teamRoutes;
