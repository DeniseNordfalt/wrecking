import {model, schema} from 'mongoose';



const thirdGiftSchema = new schema({

});

//getAction
ThirdGift.statics.getAction = async function (path) {
    try {
        const response = await ThirdGift.callApi(path);
        return response;
    } catch (error) {
        console.log(error);
    }
};

//setStationOwner

//underCapture

//createRound

//updateRoundTime

//updateTeamScore

//setActiveStations

//updateStation

//updateTeam

//createStation

//modifyStation

//createTeam

//modifyTeam

//submitCalibrationCode

//callApi
ThirdGift.statics.callApi = async function (path) {
    try {
        const response = await axios.get(path);
        const data = await response.data;
        return data;
    } catch (error) {
        console.log(error);
        throw error; // Re-throw the error to handle it in the caller function
    }
};

//callApiBackground

//makeRequest

//getStation

const ThirdGift = model('ThirdGift', thirdGiftSchema);

export default ThirdGift;