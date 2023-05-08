import { Router } from "express";

const publicRoutes = Router();

publicRoutes.get("/", function (req, res) {
  // handle request for public page
  res.send("public");
});

publicRoutes.get("/teams", function (req, res) {
  // handle request for teams page
  res.send("public teams");
});

export default publicRoutes;
