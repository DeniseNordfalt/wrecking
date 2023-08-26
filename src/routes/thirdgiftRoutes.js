import { Router } from "express";

const thirdgiftRoutes = Router();

/* 

Thirdgift Controller:

! GET /thirdgift - Index action
! GET /thirdgift/user/:name - Custom collection action for retrieving users
! GET /thirdgift/users - Custom collection action for retrieving users

*/



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
