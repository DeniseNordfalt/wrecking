import { getAction } from "../axios/apiController.js";

//INDEX
// ! implement

//USER
// ! implement

//USERS
// ! implement


const getIndex = async () => {

    console.log('lanternTeams', await getLanternTeams())
    console.log('activeStations', await getActiveStations())
    console.log('inactiveStations', await getInactiveStations())
    // console.log('roundStats', await getRoundStats())
    
}
const getLanternTeams = async () => {
    try {
        const teams = await getAction("/lanternTeams").then((response) => {
            return JSON.stringify(response?.data?.teams)

        });
        return teams
    } catch (error) {
        console.log(error);

    }
};

const getActiveStations  = async () => {
    try {
        const active = await getAction("/lanternStations").then((response) => {
            return JSON.stringify(response?.data?.activeStations)

        });
        return active
    } catch (error) {
        console.log(error);

    }
};

const getInactiveStations  = async () => {
    try {
        const inactive = await getAction("/lanternStations").then((response) => {
            return JSON.stringify(response?.data?.inactiveStations)

        });
        return inactive
    } catch (error) {
        console.log(error);

    }
};

// const getRoundStats = async () => {
//     try {
//         const roundStats = await getAction("/lanternRounds").then((response) => {
//             // return JSON.stringify(response?.data)
//             // console.log('roundStats', response)
            
//            response?.data?.rounds.map((round) => {

//             console.log('roundStats', round)


//         });

//         return roundStats

//     });

        
//     } catch (error) {
//         console.log(error);

//     }
// }

//user

const getUser = async (req, res) => {
//@user
//thirdgift.get_Action("/users/:name")["data"]["user"]

const name = req.params.name;
const response = await axios.get(`/users/${name}`);
const user = response.data.user;
console.log(user);
res.json(user);
}


//users
// const getUsers = async (req, res) => {
// //@users
// //thirdgift.get_Action("/users")["data"]["users"]

// // const response = await axios.get("/users");
// // const users = response.data.users;
// // console.log(users);
// const response = await getAction("/users")
// console.log('getusers', response)
// }

const getUsers = async (req, res) => {
    try {
      const users = await getAction("/users").then((response) => {
        return JSON.stringify(response?.data?.users)
        });
      console.log('getusers', users);
      const users2 = JSON.parse(users)
        console.log('getusers', users2);
        const users3 = users2.map((user) => {
            return user.username
        })
        console.log('getusers', users3);

        res.json(users3);

    } catch (error) {
      console.log(error);

    }
  };

export { getUser, getUsers, getIndex };
