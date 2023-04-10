require("dotenv").config();
const sendManualEmergency = require("../helpers/manualMessage");
const EmergencyHistory = require("../model/history");
const { translateError } = require("./mongo_helper");
const { getEmergencyTypeById } = require("./type");

const addEmergencyHistory = async(body) => {
    const {user, type, latitude, longitude} = body;
    try {
        const emergencyType = getEmergencyTypeById({id: type});
        console.log(emergencyType, "Type");

        const message = await sendManualEmergency({latitude, longitude, emergencyType});

        console.log(message);
        if(message){
            const newHistory = new EmergencyHistory({user, type});
            if(await newHistory.save()){
                return [true, "Emergency sent and saved successfully"];
            }
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const getAllHistory = async () => {
    try {
       const allHistory = EmergencyHistory.find({});
       console.log(allHistory, "All history");

       if(allHistory !== null){
        return [true, allHistory]
       }else{
        return [false, "No emergency history found"]
       }
    } catch (error) {
        return [false, translateError(error)]
    }
}

module.exports = {
    addEmergencyHistory,
    getAllHistory
}