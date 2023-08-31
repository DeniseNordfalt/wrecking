import Round from "./models/round.js";
import Team from "./models/team.js";

import { utcLocalDate } from "./helpers/date.js";


async function playGameRound() {
  console.log("Let's play a game");
  const interval = 1000; // 1 second
  const round = await Round.findOne().sort("-endtime");
  let firstUpdate = Date.now();

  if (round) {
    while (Date.now() <= round.endtime.getTime()) {
      const activeRound = await Round.findOne({ active: true });
      console.log("now", Date.now(), "endtime", round.endtime.getTime());

      if (activeRound) {
        const teams = await Team.find().populate("stations");

        for (const team of teams) {
          for (const station of team.stations) {
            if ((1 << (station.id - 1)) & activeRound.stations) {
              team.score += station.boost;
            }
          }
          await team.save();
        }
      }

      const timeElapsed = Date.now() - firstUpdate;
      if (timeElapsed >= interval) {
        firstUpdate += timeElapsed;
      }

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    console.log("Round ended");
    await round.updateOne({ active: false });
  }
}

async function watchGameRound() {
  console.log("Watching you");
  const interval = 10000; // 10 seconds
  const game = true;
  while (game) {
    // const now = new Date();
    const now = utcLocalDate();
    console.log("now", now)
  //  console.log('utc', utcLocalDate(now))

    //finds the round that is active
    const round = await Round.findOne({
      starttime: { $lte: now },
      endtime: { $gte: now },
    });
    console.log("round", round)

    if (round) {
      await round.updateOne({ active: true });
      await Team.clear_captured_stations();
    }

    //if active round, start the game
    const activeRound = await Round.findOne({ active: true });
    if (activeRound) {
      let lastTick = Date.now();

      while (Date.now() < activeRound.endtime.getTime()) {
        const teams = await Team.find().populate("stations");

        for (const team of teams) {
          for (const station of team.stations) {
            if (activeRound.test_station.includes(station.bit_id)) {
              team.score += station.boost;
            }
          }

          await team.save();
        }

        const timeElapsed = Date.now() - lastTick;
        if (timeElapsed >= interval) {
          lastTick += interval;

          console.log("tick");
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await activeRound.updateOne({ active: false });
      console.log("Round ended");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("No game");
  }
}

export { playGameRound, watchGameRound };
