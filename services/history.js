require("dotenv").config();
const { default: mongoose } = require("mongoose");
const sendManualEmergency = require("../helpers/manualMessage");
const EmergencyHistory = require("../model/history");
const EmergencyType = require("../model/type");
const { translateError } = require("./mongo_helper");
const { getEmergencyTypeById } = require("./type");

const addEmergencyHistory = async (body) => {
  const { user, type, latitude, longitude } = body;
  try {
    const id = type;
    const emergencyType = await getEmergencyTypeById(id);
    console.log(emergencyType, "Type", body);

    const message = await sendManualEmergency({
      latitude,
      longitude,
      type: emergencyType[1],
    });
 

    if (message) {
      const newHistory = new EmergencyHistory({ user, type });
      if (await newHistory.save()) {
        return [true, "Emergency sent and saved successfully"];
      }
    }
  } catch (error) {
  
    return [false, translateError(error)];
  }
};

const getAllHistory = async () => {
  try {
    const allHistory = EmergencyHistory.find({});
 

    if (allHistory !== null) {
      return [true, allHistory];
    } else {
      return [false, "No emergency history found"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getHistoryByUser = async (id) => {
  try {
    const userHistory = await EmergencyHistory.find({ "user": mongoose.Types.ObjectId(id)}).populate('type');
  
    if (userHistory !== null) {
      return [true, userHistory];
    } else {
      return [false, "No emergency history found for this user"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

module.exports = {
  addEmergencyHistory,
  getAllHistory,
  getHistoryByUser,
};
