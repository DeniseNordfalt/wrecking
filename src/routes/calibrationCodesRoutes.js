import { Router } from "express";
import CalibrationCode from "../models/calibrationCode.js";

const calibrationCodeRoutes = Router();

//GET all calibration codes
calibrationCodeRoutes.get("/", async (req, res) => {
const codes = await CalibrationCode.find().sort({createdAt: -1});
res.json(codes);

});

// POST new calibration code
calibrationCodeRoutes.post("/", async (req, res) => {
    try {
        const { owner, code, completed, station_id } = req.body;
        const newCalibrationCode = new CalibrationCode({ owner, code, completed, station_id });
        await newCalibrationCode.save();
        res.status(201).json(newCalibrationCode);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
});


// DELETE calibration code by id
calibrationCodeRoutes.delete("/:id", async (req, res) => {
const id = req.params.id;
try {
    const deletedCode = await CalibrationCode.findByIdAndDelete(id);
    res.json(deletedCode);
} catch (error) {
    res.status(404).json({ message: error.message });
}
});


// GET calibration codes/active
calibrationCodeRoutes.get("/active", async (req, res) => {
   const codes = await CalibrationCode.find({completed: false}).sort({createdAt: -1});
    res.json(codes);
});

// GET calibration codes/top-list
calibrationCodeRoutes.get("/top-list", async (req, res) => {
  const codes = await CalibrationCode.aggregate([
    { $match: { completed: true } },
    {
        $group: {
            _id: '$owner',
            count: { $sum: 1 },
        },
    },
    { $sort: { count: -1 } }, // Sort by count in descending order
]);

const topList = codes.map((code) => ({
    owner: code._id,
    count: code.count,
}));

res.json(topList);
});

// PATCH calibration codes/:id
calibrationCodeRoutes.patch("/:id", async (req, res) => {
    const id = req.params.id;
    const { owner, code, completed, station_id } = req.body;
    try {
        const calibrationCode = await CalibrationCode.findById(id);

    if (!calibrationCode) {
      return res.status(404).json({ error: "Calibration code not found" });
    }

    const newCode = await CalibrationCode.findOneAndUpdate(
        { _id: id },
        { owner, code, completed, station_id },
        { new: true }
    );



    return res.status(200).json(newCode);
  } catch (error) {
    console.error("Error updating calibration code:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});




export default calibrationCodeRoutes;