import { Schema, model } from "mongoose";

const teamSchema = new Schema({
  team_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  score: { type: Number, default: 0, nullable: false },
  colour: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  shortName: { type: String, required: true, maxlength: 5 },
  captured_stations: { type: [String], default: [] },
  stations: [{ type: Schema.Types.ObjectId, ref: "Station" }],
});

teamSchema.statics.clear_captured_stations = async function () {
  await this.updateMany({}, { captured_stations: [] });
};

teamSchema.methods.check_capture_bonus = async function (station) {
  if (this.captured_stations.includes(station)) {
    console.log("Station already captured");
    return;
  }
  console.log("Station captured");

  this.captured_stations.push(station);
  this.score += 10000;

  await this.save();
};

teamSchema.methods.remove_station = async function (station) {
  try{
  // this.stations.pull(station._id);
  // this.captured_stations.pull(station.bit_id);
  // await this.save();
  console.log('removing station', station);
  console.log('station._id', station._id);
  console.log('station.bit_id', station.bit_id);
  await this.updateOne({$pull: {stations: station._id, captured_stations: station.bit_id}});
  }
  catch(err){
    console.log(err);
  }

};

// teamSchema.methods.reset_score = async function () {
//   this.score = 0;
//   await this.save();
// };

// teamSchema.methods.add_score = async function (score) {
//   this.score += score;
//   await this.save();
// };

// teamSchema.methods.reset_captured_stations = async function () {
//   this.captured_stations = [];
//   await this.save();
// };

//make the model with a max of 4 teams
const Team = model("Team", teamSchema, "teams", { max: 4 });

export default Team;
