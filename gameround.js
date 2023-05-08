import Station from "./models/station.js";
import Round from "./models/round.js";
import Team from "./models/team.js";
import { DateTime } from "luxon";
import { formatDate } from "./helpers/date.js";
import sleep from "./helpers/sleep.js";

const INTERVAL = 100;
const MAX_ROUNDS = 10;

export default class GameRound {
  constructor() {
    this.round = 1;
    this.stations = [];
    this.interval = null;
  }

  // watches for active rounds
  // async watch() {
  //   // watches for active rounds
  //   console.log("WATCHING YOU!");
  //   this.interval = 10;

  //   while (true) {
  //     // Sets the timezone to Sweden and gets the current time
  //     const swedenTime = DateTime.local().setZone("Europe/Stockholm");
  //     const now = swedenTime.toISO();

  //     // Finds all rounds starting before or equal to now and ending after now
  //     const activeRounds = await Round.find({
  //       starttime: { $lte: now },
  //       endtime: { $gte: now },
  //     });

  //     // sets the rounds to active if not active
  //     for (const round of activeRounds) {
  //       console.log("round: ", round);
  //       if (round.active) {
  //         console.log("round is active");
  //         continue;
  //       }
  //       console.log("round is not active");
  //       round.active = true;
  //       round.save();
  //       //this.start();
  //     }

  //     // clear captured stations on all teams
  //     Team.clear_captured_stations()
  //       .then(() => {
  //         console.log("clearing captured stations");
  //       })
  //       .catch((err) => {
  //         console.log("error clearing captured stations: ", err);
  //       });

  //     const activeRound = await Round.findOne({ active: true })
  //       .sort({ _id: -1 })
  //       .exec();

  //     if (activeRound) {
  //       //thirdgift.update_round_time()
  //       //thirdgift.set_active_stations()
  //       console.log("got active round");
  //       let lastTick = new Date();

  //       while (new Date() < activeRound.endtime) {
  //         if (new Date() - lastTick > this.interval) {
  //           console.log("tick");
  //           lastTick += this.interval;
  //           console.log("last tick: ", lastTick);

  //           const teams = await Team.find().populate("stations");
  //           teams.forEach(async (team) => {
  //             team.stations.forEach(async (station) => {
  //               if (
  //                 (1 << (station.id - 1)) &
  //                 (activeRound.stations === 1 << (station.id - 1))
  //               ) {
  //                 team.score += station.boost;
  //               }
  //             });
  //             await team.save((err) => {
  //               if (err) {
  //                 console.log(err);
  //                 return;
  //               }
  //               //Thirdgift.update_team_score(team);
  //             });
  //           });

  //           /*const teams = await Team.find().populate("stations");
  //           teams.forEach(async (team) => {
  //             team.stations.forEach(async (station) => {
  //               if ((1 << (station.id - 1)) & activeRound.stations) {
  //                 team.score += station.boost;
  //               }
  //             });
  //             await team.save();
  //           }); */
  //         }
  //       }
  //     }

  //     await sleep(20000);
  //     console.log("sleeping");
  //   }

  //   //this.start();
  // }

  async watch() {
    while (true) {
      console.log("WATCHING YOU!");
      // Sets the timezone to Sweden and gets the current time
      //const swedenTime = DateTime.local().setZone("Europe/Stockholm");
      //const now = swedenTime.toISODate();

      const now = new Date();

      //finds active rounds
      const activeRounds = await Round.find({
        starttime: { $lte: now },
        endtime: { $gte: now },
      });

      // sets the rounds to active if not active
      activeRounds.forEach(async (round) => {
        if (round.active) {
          console.log("round is active");
          return;
        }
        console.log("round is not active");
        round.active = true;
        await round.save();
        console.log("round saved");
      });

      //clears captured stations on all teams
      await Team.clear_captured_stations();

      //finds active round
      const activeRound = await Round.findOne({ active: true })
        .sort({ id: -1 })
        .limit(1);

      if (activeRound) {
        console.log("got active round");
        let lastTick = new Date();

        while (new Date() < activeRound.endtime) {
          if (new Date() - lastTick > this.interval) {
            lastTick += this.interval;

            const teams = await Team.find().populate("stations");

            //TODO: remove testcode
            const stations = await Station.find();
            await Team.updateMany({}, { $set: { stations } });
            // TODO: remove testcode

            teams.forEach(async (team) => {
              team.stations.forEach(async (station) => {
                // bitshift left
                // 1 << 0 = 1 --- station 1 0001
                // 1 << 1 = 2 --- station 2 0010
                // 1 << 2 = 4 --- station 3 0100
                // 1 << 3 = 8 --- station 4 1000
                //  default int 15 = 1111
                // checks which stations are active in game

                if (
                  ((1 << (station.id - 1)) & activeRound.stations) ==
                  1 << (station.id - 1)
                ) {
                  team.score += station.boost;
                }
              });
              console.log("team ", team.score);
              await team.save();
            });
          }
        }
      }

      await sleep(10000);
      //console.log("round: ", rounds);
    }
  }

  start() {
    //this.interval = setInterval(this.tick.bind(this), INTERVAL);
    console.log("STARTING!");
    this.interval = setInterval(this.tick.bind(this), this.INTERVAL);
  }

  async tick() {
    console.log("tick");
    this.stations = await Station.find({});

    this.stations.forEach((station) => {
      if (station.under_capture) {
        if (station.boost <= 0) {
          station.boost += 0;
          console.log("station boost: ", station.boost);
          station.save();
        } else {
          station.boost -= 10;
          console.log("station boost: ", station.boost);
          station.save();
        }
      }
    });

    if (this.round >= MAX_ROUNDS) {
      console.log("stop");
      this.stop();
    }

    this.round++;
  }

  stop() {
    clearInterval(this.interval);
  }
}
