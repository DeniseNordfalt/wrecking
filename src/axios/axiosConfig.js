import axios from 'axios'; 
import dotenv from 'dotenv';
// to be able to use .env file
dotenv.config();
console.log(dotenv.config())

// const baseURL = 'https://icanhazdadjoke.com/';
//const baseURL = 'https://terminal.thethirdgift.com/'
const baseURL = 'https://terminal.thethirdgift.com/api'
const token = process.env.THIRDGIFT_TOKEN
console.log('token', token)



const axiosConfig = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { 'Accept': 'application/json', 'Authorization': `${token}`},

});


export default axiosConfig;
