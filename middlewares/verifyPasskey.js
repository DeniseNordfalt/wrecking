const verifyPasskey = async (req, res, next) => {
  const inputString = req.query.key;
  const pairs = inputString.split(";");
  let key = pairs[0];

  if (key === process.env.submit_password) {
    console.log("passkey verified");
    next();
  } else {
    console.log("passkey not verified");

    res.status(401).end();
  }
};

export default verifyPasskey;
