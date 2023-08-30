import { Router } from "express";
import { getCalibrationCodes, getActiveCodes,  getTopList } from "../controllers/calibrationCodeController.js";


const calibrationCodeRoutes = Router();

//GET all codes
calibrationCodeRoutes.get("/", getCalibrationCodes);

//GET active codes
calibrationCodeRoutes.get("/active", getActiveCodes);

//Get top-list
calibrationCodeRoutes.get("/top-list", getTopList);

// DELETE code
calibrationCodeRoutes.delete("/:id", (req, res) => {
    res.send("delete calibration code");
    }
);

export default calibrationCodeRoutes;