import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import session from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { setupMongoDb } from "./src/config/db.js";
import { watchGameRound } from "./gameround.js";
import router from "./src/routes/index.js";

// to be able to use .env file
dotenv.config();

//create the express app
const app = express();

//define session cookie time
const oneDay = 1000 * 60 * 60 * 24;
//const oneHour = 1000 * 60 * 60;

// handle the body of a request
app.use(bodyParser.urlencoded({ extended: true }));

// helps with the delete and put/patch requests
app.use(methodOverride("_method"));

//set up the session for a logges in user
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

//set up the view engine for  templates
app.set("view engine", "ejs");

//checks if the user is logged in and sets a local variable to be used in the templates
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

//use all the routes from the imported router
app.use("/", router);



import {  getIndex } from "./src/controllers/thirdgiftController.js";
//getUsers()
getIndex()




//define the port, database and start the server
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1/wrecking";
app.listen(PORT, () => {
  setupMongoDb(MONGODB_URI);
  //playGameRound();
  watchGameRound();

  console.log(`Started Express at port ${PORT}`);
});

export default app;