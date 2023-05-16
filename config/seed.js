import Team from "../models/team.js";
import Station from "../models/station.js";
import CalibrationCode from "../models/calibration_code.js";

export const seed = async () => {
  const stations = [
    { location: "Vägslut", team: null, bit_id: 1 },
    { location: "Sandfält", team: null, bit_id: 2 },
    { location: "Skogsby", team: null, bit_id: 3 },
    { location: "Grusdump", team: null, bit_id: 4 },
  ];

  const teams = [
    { name: "The Cluster", shortName: "CLU", colour: "A020F0", team_id: 1 },
    { name: "Jofa Family", shortName: "NHL", colour: "90EE90", team_id: 2 },
    { name: "SnapphaneKlan", shortName: "SHK", colour: "FF0000", team_id: 3 },
    { name: "403", shortName: "403", colour: "0000FF", team_id: 4 },
  ];

  const calibrationCodes = [
    { code: "123456", owner: "test", stationId: "1" },
    { code: "654321", owner: "test", stationId: "2" },
    { code: "111111", owner: "test", stationId: "3" },
    { code: "222222", owner: "test", stationId: "4" },
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

  const calibrationCodePromises = calibrationCodes.map(async (code) => {
    const existingCode = await CalibrationCode.findOne({
      code: code.code,
    });
    if (!existingCode) {
      await CalibrationCode.create(code);
    }
  });

  await Promise.all([
    ...stationPromises,
    ...teamPromises,
    ...calibrationCodePromises,
  ]);

  console.log("Seeding complete");
};
