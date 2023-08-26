import axios from 'axios'; 
import dotenv from 'dotenv';
// to be able to use .env file
dotenv.config();
console.log(dotenv.config())

const baseURL = process.env.THIRDGIFT_BASE_URL
const token = process.env.THIRDGIFT_TOKEN
console.log('token', token)



const axiosConfig = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { 'Accept': 'application/json', 'Authorization': `${token}`},

});


export default axiosConfig;
