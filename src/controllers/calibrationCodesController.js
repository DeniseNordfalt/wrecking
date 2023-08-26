import CalibrationCode from "../models/calibrationCode.js";

//INDEX
// ! implement

//ACTIVE 
// ! implement

//TOP LIST
// ! implement

//DESTROY
// ! implement


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
        .sort({createdAt: 1}).limit(1);
        res.status(200).json(calibrationCodes);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// export const getTopList = async (req, res) => {
//     try {
//         const calibrationCodes = await CalibrationCode
//         .find({completed: true})
//         .group({ _id: "$owner", count: { $sum: 1 } })
//         .sort({updatedAt: -1}).limit(10);
//         res.status(200).json(calibrationCodes);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// }

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

  export const deleteCalibrationCode = async (req, res) => {
    try {
        const calibrationCode = await CalibrationCode.findByIdAndDelete(req.params.id);
        res.status(200).json(calibrationCode);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// ! reports controller???

export const verifyCalibrationCode = async (req, res) => {
    try {
      const code = await CalibrationCode.findOne({
        code: req.params.code,
        station_id: req.params.id,
        completed: false
      });
  
      if (code) {
        const apiStatus = await Thirdgift.submitCalibrationCode(code);
  
        if (apiStatus) {
          code.completed = true;
          await code.save();
          res.status(200).send("Ok:1");
        } else {
          res.status(200).send("Ok:0");
        }
      } else {
        res.status(200).send("Ok:0");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }

export const setMission = async (req, res) => {
    try {
      const mission = req.body.mission; // Assuming the mission data is sent in the request body
  
      // Disable old calibration codes for the owner
      await CalibrationCode.disableOld(mission.owner);
  
      // Create a new CalibrationCode document
      const code = new CalibrationCode({
        owner: mission.owner,
        code: mission.code,
        station_id: mission.stationId,
        completed: mission.completed || false,
      });
  
      // Save the new code to the database
      await code.save();
  
      res.json({ status: 'ok' });
    } catch (error) {
      console.error(error);
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(422).json({ error: 'Validation Error' });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }

  export function verifyPasskey(req, res, next) {
    const key = req.body.key; // Assuming the key is sent in the request body
  
    if (key === process.env.SUBMIT_PASSWORD) {
      console.log(`Password ${key} is valid`);
      next(); // Pass control to the next middleware or route handler
    } else {
      console.log(`Password ${key} is invalid`);
      res.status(401).send('Unauthorized'); // Respond with a 401 Unauthorized status
    }
  }