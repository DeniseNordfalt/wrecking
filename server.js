import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

import { setupMongoDb } from "./config/db.js";

// import { playGameRound, watchGameRound } from "./gameround_two.js";
import { watchGameRound } from "./gameround_two.js";

import router from "./routes/index.js";

const app = express();
const PORT = 3000;

const oneDay = 1000 * 60 * 60 * 24;
//const oneHour = 1000 * 60 * 60;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: oneDay,
    },
  })
);

app.use(cors());
app.use(json());

app.use(cookieParser());
app.set("view engine", "ejs");

app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.currentUser = req.session.userId;
  }

  next();
});

//makes sure the server can handle css stylesheets
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));

//get all the routes from the router
app.use("/", router);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/wrecking";

app.listen(PORT, () => {
  setupMongoDb(MONGODB_URI);
  //playGameRound();
  watchGameRound();

  console.log(`Started Express at port ${PORT}`);
});
