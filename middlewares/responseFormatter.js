const responseFormatter = (req, res, data, template) => {
  res.format({
    "text/html": function () {
      res.render(template, { data: data });
    },
    "application/json": function () {
      res.json(data);
    },
    default: function () {
      res.status(406).send("Not Acceptable");
    },
  });
};

export default responseFormatter;
