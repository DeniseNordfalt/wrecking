// export const setupRoutes = (app) => {
//     app.use("/api", api);
//     app.use("/api", reports);
//     app.use("/api", thirdgift);
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

const date = Date.now();
console.log("format date", formatDate(date));
