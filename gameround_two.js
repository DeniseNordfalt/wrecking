import sleep from "./helpers/sleep.js";
import Round from "./models/round.js";
import Team from "./models/team.js";

async function playGameRound() {
  console.log("Let's play a game");
  const interval = 1000; // 1 second
  const round = await Round.findOne().sort("-endtime");
  let lastTick = Date.now();
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
        lastTick += interval;
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

  while (true) {
    const now = new Date();

    const round = await Round.findOne({
      starttime: { $lte: now },
      endtime: { $gte: now },
    });

    if (round) {
      await round.updateOne({ active: true });
      // await Team.clearCapturedStations();
      //TODO: FIX THIS
    }

    const activeRound = await Round.findOne({ active: true });
    if (activeRound) {
      //Thirdgift.updateRoundTime();
      //Thirdgift.setActiveStations();

      let lastTick = Date.now();

      while (Date.now() < activeRound.endtime.getTime()) {
        const teams = await Team.find().populate("stations");

        for (const team of teams) {
          for (const station of team.stations) {
            if ((1 << (station.bit_id - 1)) & activeRound.stations) {
              team.score += station.boost;
            }
          }
          await team.save();
          //Thirdgift.updateTeamScore(team);
        }

        const timeElapsed = Date.now() - lastTick;
        if (timeElapsed >= interval) {
          lastTick += interval;
          //Thirdgift.setActiveStations();
          console.log("tick");
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      await activeRound.updateOne({ active: false });
      //Thirdgift.updateRoundTime();
      //Thirdgift.setActiveStations();
      console.log("Round ended");
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("No game");
  }
}

export { playGameRound, watchGameRound };
