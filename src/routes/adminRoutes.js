import { Router } from "express";

const adminRoutes = Router();

// Admin
adminRoutes.get("/", (req, res) => {
  res.render("admin/index");
});

export default adminRoutes;
