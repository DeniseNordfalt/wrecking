import { Router } from "express";

const thirdgiftRoutes = Router();

thirdgiftRoutes.get("/thirdgift/user/:name", (req, res) => {
  res.send(`thirdgift user ${req.params.name}`);
});

thirdgiftRoutes.get("/thirdgift/users", (req, res) => {
  res.send("thirdgift users");
});

export default thirdgiftRoutes;
