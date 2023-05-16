import Station from "../models/station.js";

const reportCom = async (req, res, next) => {
  const params = req.params.station;
  if (
    params !== undefined &&
    params !== null &&
    params !== "" &&
    params !== " "
  ) {
    const station = await Station.findOne({ bit_id: params });
    if (!station) {
      next();
    } else {
      station.latest_com = Date.now();
      await station.save();
    }

    next();
  }
};

export default reportCom;
