
import axios from '../src/axios/axiosConfig.js'
import { expect } from 'chai';

const url = process.env.THIRDGIFT_BASE_URL

describe('Thirdgift API calls', () => {

   //lanternteams
   //Thirdgift.get_action("/lanternTeams")["data"]["teams"]
   it('should fetch lanternTeams', async () => {
    const response = await axios.get(`${url}/lanternTeams`);
    expect(response.status).to.equal(200);

});
    //active lanterns
    // Thirdgift.get_action("/lanternStations")["data"]["activeStations"]

    it('should fetch active lanterns', async () => {
        const response = await axios.get(`${url}/lanternStations`);
        expect(response.data.data.activeStations).to.be.an('array');
        expect(response.status).to.equal(200);

    });

    //inactive lanterns
    // Thirdgift.get_action("/lanternStations")["data"]["inactiveStations"]
    it('should fetch inactive lanterns', async () => {
       try{
        const response = await axios.get(`${url}/lanternStations`);
        expect(response.data.data.inactiveStations).to.be.an('array');
        expect(response.status).to.equal(200);
       } catch (error) {
              console.log(error)
         }
    });

    // round stats
    // Thirdgift.get_action("/lanternRounds")["data"]
 it('should fetch round stats', async () => {
        const response = await axios.get(`${url}/lanternRounds`);
        expect(response.status).to.equal(200);

    });

    //calibration codes
    // Thirdgift.get_action("/calibrationMissions/active")["data"]["missions"]
 it('should fetch calibration codes', async () => {
        const response = await axios.get(`${url}/calibrationMissions/active`);
        expect(response.status).to.equal(200);

    });

    //users
    // Thirdgift.get_action("/users")["data"]["users"]
 it('should fetch all users', async () => {
        const response = await axios.get(`${url}/users`);
        expect(response.status).to.equal(200);

    });

    //user
    // Thirdgift.get_action("/users")["data"]["users"]
    // @user = users.select {|user| user["userName"] == params[:name]}.first
 it('should fetch an individual user', async () => {
    try{
        const response = await axios.get(`${url}/users/64db647c5a3d83001252260d`);
        expect(response.status).to.equal(200);
    } catch (error) {
        console.log(error)
    }
    });

    after(() => {
        process.exit();
      });
});