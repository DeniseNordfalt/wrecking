import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

// import router from "./routes";
import { setupMongoDb } from "./config/db.js";
import { seed } from "./config/seed.js";

import GameRound from "./gameround.js";
import { playGameRound, watchGameRound } from "./gameround_two.js";

import routes from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.send("server is running");
// });

//app.use("/", routes);
app.get("/", (req, res) => {
  res.send("test");
});

//const MONGODB_URI = "mongodb://127.0.0.1/wrecking";

//const MONGODB_URI = process.env.MONGODB_URI;

app.listen(PORT, () => {
  //setupMongoDb(MONGODB_URI);
  //seed();
  //const gameRound = new GameRound();
  //gameRound.start();
  //gameRound.watch();
  //playGameRound();
  //watchGameRound();

  console.log(`Started Express at port ${PORT}`);
});
