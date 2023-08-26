import { Router } from "express";

const thirdgiftRoutes = Router();

//GET all thirdgifts
thirdgiftRoutes.get("/users", (req, res) => {
    //! get all thirdgift users?
    res.send('GET all users?')
});

//GET thirdgift by id
thirdgiftRoutes.get("/users/:name", (req, res) => {
    const name = req.params.name;
    //! get thirdgift user by name?
    res.send(`GET user ${name}?`)
});
