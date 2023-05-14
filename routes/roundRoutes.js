import { Router } from "express";
import Round from "../models/round.js";

import {
  getRounds,
  getRoundById,
  createRound,
  updateRound,
  deleteRound,
} from "../controllers/roundsController.js";

const roundRoutes = Router();

// Rounds

// GET /rounds
roundRoutes.get("/", getRounds);

//GET /rounds/:id/
roundRoutes.get("/:id", getRoundById);

//POST /rounds
roundRoutes.post("/", createRound);

//PUT /rounds/:id
roundRoutes.put("/:id", updateRound);

//PATCH /rounds/:id
roundRoutes.patch("/:id", updateRound);

//DELETE /rounds/:id
roundRoutes.delete("/:id", deleteRound);

////////////////////////////////////////////

//GET /rounds/new
roundRoutes.get("/new", async (req, res) => {
  res.send("rounds new");
});

//GET /rounds/:id/edit
roundRoutes.get("/:id/edit", async (req, res) => {
  const id = req.params.id;

  try {
    const round = await Round.findById(id);
    res.send(round);
  } catch (error) {
    res.status(404).send("Round not found");
  }
});

export default roundRoutes;
