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
    { name: "Chaos", shortName: "666", colour: "FF0000", team_id: 1 },
    { name: "Cyberkomm", shortName: "CYB", colour: "003CFF", team_id: 2 },
    { name: "Klustret", shortName: "CLU", colour: "B300FF", team_id: 3 },
    { name: "Hjortkloe", shortName: "HKM", colour: "FFBF00", team_id: 4 },
  ];

  const calibrationCodes = [
    { code: "123456", owner: "test", stationId: "6446a02b97cffc328a382a78" },
    { code: "654321", owner: "test", stationId: "6446a02b97cffc328a382a78" },
    { code: "111111", owner: "test", stationId: "6446a02b97cffc328a382a78" },
    { code: "222222", owner: "test", stationId: "6446a02b97cffc328a382a78" },
    { code: "333333", owner: "test", stationId: "6446a02b97cffc328a382a7a" },
    { code: "444444", owner: "test", stationId: "6446a02b97cffc328a382a7a" },
    { code: "555555", owner: "test", stationId: "6446a02b97cffc328a382a7a" },
    { code: "666666", owner: "test", stationId: "6446a02b97cffc328a382a7a" },
    { code: "777777", owner: "test", stationId: "6446a02b97cffc328a382a7c" },
    { code: "888888", owner: "test", stationId: "6446a02b97cffc328a382a7c" },
    { code: "999999", owner: "test", stationId: "6446a02b97cffc328a382a7c" },
    { code: "000000", owner: "test", stationId: "6446a02b97cffc328a382a7c" },
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
    const existingTeam = await Team.findOne({ team_id: team.team_id });
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
};
