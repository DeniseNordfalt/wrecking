import { Schema, model } from "mongoose";
//import Team from "./team";

const stationSchema = new Schema({
  bit_id: { type: Number }, //fix auto increment
  location: { type: String, required: true },
  //   team_id: { type: Schema.Types.ObjectId, ref: "Team" },
  team: { type: Schema.Types.ObjectId, ref: "Team" },
  team_id: { type: Number, index: true },
  boost: { type: Number, default: 100, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  latest_com: { type: Date },
  under_capture: { type: Boolean, default: false },
  reward: { type: Number },
  owner: { type: Number, default: 0 },
});

// stationSchema.methods.owner = function () {
//   if (this.team) {
//     return this.team.name;
//   }
// };

stationSchema.pre("remove", function (next) {
  // Find all dependent documents and remove them
  model("Dependent").remove({ station_id: this._id }, next);
});

stationSchema.methods.active = async function () {
  const Round = model("Round");
  const activeRound = await Round.findOne({ active: true })
    .sort({ createdAt: -1 })
    .exec();
  if (activeRound) {
    // bit shift the station id to the left by 1, then bitwise AND it with the activeRound.stations
    return (
      ((1 << (this.bit_id - 1)) & activeRound.stations) ===
      1 << (this.bit_id - 1)
    );
  } else {
    return false;
  }
};

const Station = model("Station", stationSchema);

export default Station;
