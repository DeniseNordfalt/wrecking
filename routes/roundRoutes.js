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

//POST /rounds
roundRoutes.post("/", createRound);

//GET /rounds/new
roundRoutes.get("/new", async (req, res) => {
  res.send("rounds new");
});

//GET /rounds/:id/
roundRoutes.get("/:id", getRoundById);

//PUT /rounds/:id
roundRoutes.put("/:id", updateRound);

//PATCH /rounds/:id
roundRoutes.patch("/:id", updateRound);

//DELETE /rounds/:id
roundRoutes.delete("/:id", deleteRound);

//GET /rounds/:id/edit
roundRoutes.get("/:id/edit", async (req, res) => {
  const id = req.params.id;

  try {
    const round = await Round.findById(id);
    // res.send(round);
    res.format({
      "text/html": () => {
        res.render("rounds/edit", { round: round });
      },
      "application/json": () => {
        res.send({ round: round });
      },
      default: () => {
        res.status(406).send("Not Acceptable");
      },
    });
  } catch (error) {
    res.status(404).send("Round not found");
  }
});

export default roundRoutes;
