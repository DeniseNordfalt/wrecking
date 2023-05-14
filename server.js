import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

//import router from "./routes";
import { setupMongoDb } from "./config/db.js";
import { seed } from "./config/seed.js";

// import { playGameRound, watchGameRound } from "./gameround_two.js";
import { watchGameRound } from "./gameround_two.js";

import router from "./routes/index.js";

const app = express();
const PORT = 3000;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
  })
);

app.use(cors());
app.use(json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//makes sure the server can handle css stylesheets
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));

//get all the routes from the router
app.use("/", router);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/wrecking";

app.listen(PORT, () => {
  setupMongoDb(MONGODB_URI);
  seed();
  //playGameRound();
  watchGameRound();

  console.log(`Started Express at port ${PORT}`);
});
