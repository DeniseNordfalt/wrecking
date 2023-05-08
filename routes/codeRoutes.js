import { Router } from "express";
import CalibrationCode from "../models/calibration_code.js";

const codeRoutes = Router();

// Calibration Codes
/*
codeRoutes.get("/", (req, res) => {
  const baseUrl = req.baseUrl;
  const routes = codeRoutes.stack
    .filter((layer) => layer.route && layer.route.methods.get)
    .map((layer) => layer.route.path);
  const links = routes
    .map((route) => `<li><a href="${baseUrl}${route}">${route}</a></li>`)
    .join("");
  const html = `<h1>${baseUrl}</h1><br /><ul>${links}</ul>`;
  res.send(html);
});
*/

codeRoutes.get("/", async (req, res) => {
  const json = req.query.json;
  const codes = await CalibrationCode.find();

  if (json) {
    res.send(codes);
  } else {
    res.render("calibration_codes/index", { codes: codes });
  }
});
codeRoutes.get("/active", async (req, res) => {
  const json = req.query.json;
  const activeCode = await CalibrationCode.find({ completed: false });
  if (json) {
    res.send(activeCode);
  } else {
    res.render("calibration_codes/index", { codes: activeCode });
  }
});
codeRoutes.get("/top_list", async (req, res) => {
  const json = req.query.json;
  try {
    const codes = await CalibrationCode.aggregate([
      { $match: { completed: true } },
      { $group: { _id: "$owner", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, owner: "$_id", count: 1 } },
    ]);

    const topList = {};
    codes.forEach((code) => {
      topList[code.owner] = code.count;
    });

    if (json) {
      res.json(topList);
    } else {
      res.render("calibration_codes/top_list", { topList: topList });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

codeRoutes.delete("/:id", async (req, res) => {
  const id = req.params.id;
  console.log("id", id);
  try {
    const code = await CalibrationCode.findByIdAndDelete(id);
    res.send(code + " deleted");
  } catch (error) {
    res.status(404).send("Code not found");
  }
});

export default codeRoutes;
