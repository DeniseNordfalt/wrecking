import Team from "../models/team.js";
import Station from "../models/station.js";

export const seed = async () => {
  const stations = [
    { location: "Vägslut", team: null, bit_id: 1 },
    { location: "Sandfält", team: null, bit_id: 2 },
    { location: "Skogsby", team: null, bit_id: 3 },
    { location: "Grusdump", team: null, bit_id: 4 },
  ];

  const teams = [
    { name: "TEAM RED", shortName: "RED", colour: "FF0000", team_id: 1 },
    { name: "TEAM GREEN", shortName: "GRN", colour: "00FF00", team_id: 2 },
    { name: "TEAM YELLOW", shortName: "YEL", colour: "FFFF00", team_id: 3 },
    // { name: "NULL", shortName: "NUL", colour: "000000", team_id: 4 },
  ];

  const stationPromises = stations.map(async (station) => {
    const existingStation = await Station.findOne({
      bit_id: station.bit_id,
    });
    if (!existingStation) {
      await Station.create(station);
    }
  });
  const teamPromises = teams.map(async (team) => {
    const existingTeam = await Team.findOne({ name: team.name });

    if (!existingTeam) {
      await Team.create(team);
    }
  });

  await Promise.all([...stationPromises, ...teamPromises]);

  console.log("Seeding complete");
};
