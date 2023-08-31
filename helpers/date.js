// export const setupRoutes = (app) => {
//     app.use("/api", api);
//     app.use("/api", reports);
//     app.use("/api", reset);
//     }

// takes Date.Now() and makes sure it's in the right format and in SE-se timezone

export const formatDate = (date) => {
  const options = {
    timeZone: "Europe/Stockholm",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };
  return new Intl.DateTimeFormat("sv-SE", options).format(date);
};

export const utcLocalDate = (date) => {
  let currentTimeUTC;
  if (!date) {
    // Get the current time in UTC
    currentTimeUTC = new Date();
  } else {

    currentTimeUTC = new Date(date);
  }
  // Add 2 hours to the current time to get UTC+2
  console.log("UTC: ", currentTimeUTC);
  const currentTimeUTCPlus2 = new Date(
    currentTimeUTC.getTime() + 2 * 60 * 60 * 1000
  );

  console.log("UTC+2: ", currentTimeUTCPlus2);
  return currentTimeUTCPlus2;
};
