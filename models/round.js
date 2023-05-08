import { Schema, model } from "mongoose";

const roundSchema = new Schema({
  id: { type: Number, unique: true },
  name: { type: String },
  active: { type: Boolean, default: false },

  starttime: { type: Date, required: true },
  endtime: { type: Date, required: true },
  score: { type: String, Text: true },
  stations: { type: Number, default: 15 },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

roundSchema.statics.active = function () {
  return this.where({ active: true });
};

roundSchema.statics.coming = function () {
  return this.where({ starttime: { $gt: new Date() } }).sort({ starttime: 1 });
};

roundSchema.methods.remaining = function () {
  if (this.active) {
    const seconds = Math.max(0, (this.endtime - Date.now()) / 1000);
    const hours = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secondsLeft = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hours}:${minutes}:${secondsLeft}`;
  }
};

roundSchema.methods.pending = function () {
  return this.starttime - Date.now();
};

roundSchema.methods.seconds_left = function () {
  return Math.floor((this.endtime - Date.now()) / 1000);
};

const Round = model("Round", roundSchema);

export default Round;
