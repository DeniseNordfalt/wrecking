const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema({
  //   value: {type: Number,required: true},
  //   player: {type: String, required: true,},
  id: { type: Number, unique: true },
  Score: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
