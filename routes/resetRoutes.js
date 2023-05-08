import { Router } from "express";

const resetRoutes = Router();

// Reset all
resetRoutes.put("/reset_all", (req, res) => {
  /* ... */
  console.log("reset all");
  res.send("reset all");
});

export default resetRoutes;
