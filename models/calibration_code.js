import { Schema, model } from "mongoose";

//defines the calibrationcode schema, used in hacking the stations

const CalibrationCodeSchema = new Schema({
  //_id: { type: Schema.Types.ObjectId, auto: true },
  owner: { type: String, required: true, default: "admin" },
  //stationId: { type: Schema.Types.ObjectId, ref: "Station", required: true },
  station_id: { type: Number },
  //code: { type: String, required: true },
  code: { type: Number },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

CalibrationCodeSchema.statics.disable_old = async function (owner) {
  await this.updateMany({ owner }, { completed: true });
};

const CalibrationCode = model("CalibrationCode", CalibrationCodeSchema);

export default CalibrationCode;
