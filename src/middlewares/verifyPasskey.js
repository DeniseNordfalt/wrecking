const verifyPasskey = async (req, res, next) => {
  const inputString = req.query.key || null;
  const key_two = req.body.data?.key || null;
  let key = "";

  console.log('inputString', inputString)

  if(inputString !== undefined && inputString !== null){
  const pairs = inputString.split(";");
  key = pairs[0];
  }
  console.log('key', key)
  console.log('key_two', key_two)
  console.log('process.env.submit_password', process.env.submit_password)

  
  if(key_two !== undefined && key_two !== null){
  key = key_two;
  }

  console.log('key', key)
  if (key === process.env.submit_password) {
    console.log("passkey verified");
    next();
  } else {
    console.log("passkey not verified");

    res.status(401).end();
  }
};

export default verifyPasskey;
