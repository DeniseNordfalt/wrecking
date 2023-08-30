import CalibrationCode from "../models/calibrationCode.js";


export const getCalibrationCodes = async (req, res) => {
    try {
        const calibrationCodes = await CalibrationCode.find();
        res.status(200).json(calibrationCodes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getActiveCodes = async (req, res) => {
    try {
        const calibrationCodes = await CalibrationCode.find({completed: false})
        // .sort({createdAt: 1}).limit(1);
        .sort({createdAt: 1})
        res.status(200).json(calibrationCodes);
        // ! sgould it be limited at 1?
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getTopList = async (req, res) => {
    try {
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
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

