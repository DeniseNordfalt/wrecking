const axios = require("axios");
const Station = require("./models/station");
const Team = require("./models/team");
const Round = require("./models/round");

const API_BASE_URL = "https://api.example.com";
const API_TOKEN = "YOUR_API_TOKEN";

function callApi(requestOptions) {
  requestOptions.headers = { Authorization: `Bearer ${API_TOKEN}` };
  return axios(requestOptions).then((response) => response.data);
}

async function getAction(actionPath) {
  const requestOptions = { method: "get", url: `${API_BASE_URL}${actionPath}` };
  const response = await callApi(requestOptions);
  return response;
}

async function setStationOwner(station, owner) {
  const stationId = parseInt(station);
  const ownerId = parseInt(owner) || -1;
  const requestOptions = {
    method: "post",
    url: `${API_BASE_URL}/lanternStations/${stationId}`,
  };
  requestOptions.params = { data: { station: { owner: ownerId } } };
  await callApi(requestOptions);
}

async function underCapture(station) {
  const stationId = parseInt(station);
  const requestOptions = {
    method: "post",
    url: `${API_BASE_URL}/lanternStations/${stationId}`,
  };
  requestOptions.params = { data: { station: { isUnderAttack: true } } };
  await callApi(requestOptions);
}

async function createRound(id, startTime, endTime) {
  // Not implemented
}

async function updateRoundTime() {
  let active = false;
  let startTime = "";
  let endTime = null;

  const activeRounds = await Round.find({ isActive: true });
  if (activeRounds.length > 0) {
    const round = activeRounds[0];
    active = true;
    startTime = round.startTime.toISOString();
    endTime = round.endTime.toISOString();
  } else {
    const comingRounds = await Round.find({ isActive: false });
    if (comingRounds.length > 0) {
      const round = comingRounds[0];
      startTime = round.startTime.toISOString();
    }
  }

  const requestOptions = {
    method: "post",
    url: `${API_BASE_URL}/lanternRounds/time`,
  };
  requestOptions.params = { data: { startTime, endTime, isActive: active } };
  await callApi(requestOptions);
}

async function updateTeamScore(team) {
  const requestOptions = {
    method: "post",
    url: `${API_BASE_URL}/lanternTeams/${team.id}`,
  };
  requestOptions.params = { data: { team: { points: team.score } } };
  await callApi(requestOptions);
}

async function setActiveStations() {
  const stations = await Station.find();
  for (const station of stations) {
    const isActive = station.active;
    const requestOptions = {
      method: "post",
      url: `${API_BASE_URL}/lanternStations/${station.id}`,
    };
    requestOptions.params = { data: { station: { isActive } } };
    await callApi(requestOptions);
  }
}

async function updateStation(station) {
  station.team_id = station.team_id || -1;
  try {
    const result = await modifyStation(station);
    if (result.data.station.stationId === station.id) {
      return true;
    }
  } catch {
    try {
      const result = await createStation(station);
      if (result.data.station.stationId === station.id) {
        return true;
      }
    } catch {
      return false;
    }
  }
}
