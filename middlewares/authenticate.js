const authenticate = (req, res, next) => {
  const isAuthenticated = true;

  if (isAuthenticated) {
    console.log("User is authenticated");
    next();
  } else {
    res.status(401).send("Unauthorized");
    // res.redirect('/login');
  }
};

export default authenticate;
