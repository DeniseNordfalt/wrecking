import { Schema, model } from "mongoose";

const calibrationCodeSchema = new Schema({
    owner: { type: String, required: true, trim: true,  maxlength: 255 },
    station_id: { type: Number, required: true },
    code: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const CalibrationCode = model("CalibrationCode", calibrationCodeSchema);

CalibrationCode.disableOld = async function(owner) {
    try{
        await CalibrationCode.updateMany({owner: owner}, {completed: true})
    }
    catch(e){
        console.log(e)
    }
}

export default CalibrationCode;