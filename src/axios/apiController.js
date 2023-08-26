import axios from './axiosConfig.js';

// export const getAction = async (path) => {
//     console.log('path', path)
//     console.log("inside get action");
//     try {
//     await axios.get(path)
//     .then (response => {
//         const data = JSON.stringify(response?.data)
//         console.log('getAction', data)
//         return data
//     })}
//     catch (error) {
//         console.log(error)
//     }

//     // return response;
// }

export const getAction = async (path) => {
    console.log('path', path);
    try {
      const response = await axios.get(path);
      const data = await response.data;
      return data;
    } catch (error) {
      console.log(error);
      throw error; // Re-throw the error to handle it in the caller function
    }
  };

// export const postAction = async (path, data) => {
//     const response = await axios.post(path, data);
//     return response;
// }

// export const putAction = async (path, data) => {
//     const response = await axios.put(path, data);
//     return response;
// }

// export const deleteAction = async (path) => {
//     const response = await axios.delete(path);
//     return response;
// }

// export const patchAction = async (path, data) => {
//     const response = await axios.patch(path, data);
//     return response;
// }


// Define functions for making API requests
export async function callApi(options) {
  try {
    const response = await axios({
      method: options.method || 'get',
      url: `https://bbrterminal.thethirdgift.com/api${options.path}`,
      headers: {
        Authorization: process.env.THIRDGIFT_API_TOKEN,
        'Content-Type': 'application/json',
      },
      data: options.params || {},
      timeout: 10000,
    });

    return response.data;
  } catch (error) {
    console.error(error.response || error);
    throw new Error('Error calling API');
  }
}

export async function callApiBackground(options) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const result = await callApi(options);
      resolve(result);
    }, 0);
  });
}

// export async function createTeam(team) {
//   team = {
// id: 1,
// short_name: '[000]',
// name: 'Test Team',
// score: 0,
//   }
//   const requestOptions = {
//     method: 'post',
//     path: '/lanternTeams',
//     params: {
//       data: {
//         team: {
//           teamId: team.id,
//           shortName: team.short_name,
//           teamName: team.name,
//           points: team.score,
//         },
//       },
//     },
//   };

//   return await callApi(requestOptions);
// }

