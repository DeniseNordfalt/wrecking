# Wrecking

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoftazure&logoColor=white)

## Table of Contents
- [Wrecking](#wrecking)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Tech](#tech)
  - [Database](#database)
  - [Routes](#routes)
  - [Models](#models)
  - [Controllers](#controllers)
  - [Middleware](#middleware)
  - [Views](#views)
  - [Public](#public)
  - [Other files](#other-files)
- [API](#api)
  - [Teams](#teams)
  - [Stations](#stations)
  - [Reports](#reports)
  - [Rounds](#rounds)
- [To Do](#to-do)

## Introduction
Wrecking is a web application for Blodsband Reloaded. It is used to manage the game 'Wrecking'. It is also used to report the results of the game.

## Installation
To install the project, you need to have Node.js and npm installed on your computer. You also need to have a MongoDB database. The database can be hosted on MongoDB Atlas or locally on your computer.


1. Clone the repository
2. Install the dependencies by running `npm install` in the root folder
3. Create a `.env` file in the root folder
4. Set the `MONGODB_URI` environment variable to the connection string of your database
5. Set the `PORT` environment variable to the port you want the server to run on
6. Set the `submit_password` environment variable to a secret string
7. Set the `SESSION_SECRET` environment variable to a secret string


## Usage

To run the project, run `npm start` in the root folder.

To run the project in development mode, run `npm run dev` in the root folder.

server.js is the main file that runs the server. 

## Tech
Some routes and endpoints are only reachable by the LANTERNs (or Postman)


## Database

The database is a MongoDB database. The database is hosted on MongoDB Atlas. 

 `db.js` in the `config` folder is responsible for connecting to the database. It uses the `mongoose` library to connect to the database. 

 to connect to the database, you need to set the `MONGODB_URI` environment variable in `.env` to the connection string.

 `seed.js` in the `config` folder is responsible for seeding the database with some predefined teams and stations. 

## Routes

The routes are defined in the `routes` folder. 
Every route is defined in a separate file, then imported to index.js in the `routes` folder.

## Models

The models are defined in the `models` folder. 
Mongoose is used to define the schemas and models.

## Controllers

The controllers are defined in the `controllers` folder.
The controllers are responsible for handling the logic between the routes and the models.

## Middleware

The middleware is defined in the `middleware` folder.

## Views

The views are defined in the `views` folder.
Views are rendered using the `ejs` template engine, but for most pages another frontend could be used if `Accept` header is set to `application/json` when making the request to the server.

## Public

The public folder contains the static files.
Mostly the CSS and image files.

## Other files

`package.json` contains the dependencies and scripts for the project.


# API

## Teams
/teams
/teams/:id

## Stations
/stations
/stations/:id

## Reports
Handles the logic between the server and the stations.
/reports
/reports/:station/go (get owner)
/reports/:station/so (set owner)
/reports/:station/uc (under capture)
/reports/:station/tts (time to start)
/reports/:station/gb (get boost)

## Rounds
/rounds
/rounds/:id


# To Do

- [ ] Fix bitwise shift
- [ ] Update frontend
- [ ] Add  tests
- [ ] Connect to thirdgift
- [ ] Probably 100 other things
- [ ] Rewrite the whole thing?




