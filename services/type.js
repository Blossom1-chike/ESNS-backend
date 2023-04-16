require("dotenv").config();
const EmergencyType = require("../model/type");

const createEmergencyType = async (body) => {
  try {
    const newType = new EmergencyType(body);

    if (await newType.save()) {
      return [true, newType];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getEmergencyByType = async (type) => {
  try {
    const data = await EmergencyType.findOne({ type });
    if (type !== null) {
      return [true, data];
    } else {
      return [false, "Type does not exist, or type is null"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getEmergencyTypeById = async (id) => {
  try {
    const type = await EmergencyType.findById(id);

    if (type) {
      return [true, type];
    } else {
      return [false, "Emergency type not found"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const saveAllEmergencyTypes = async (data) => {
  try {
    const all = await EmergencyType.insertMany(data, { ordered: true });

    if (all) {
      return [true, all];
    } else {
      return [false, "Something went wrong, cannot create all emergencies"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const deleteEmergencyType = async (id) => {
  try {
    const deletedType = await EmergencyType.findOneAndDelete(id);
    if (deletedType) {
      return [true, deletedType];
    } else {
      return [
        false,
        "Emergency type does not exist, It is null or has been deleted",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const updateEmergencyType = async (id, fields) => {
  try {
    const type = await EmergencyType.findByIdAndUpdate(id, fields, {
      new: true,
    });

    if (type !== null) {
      return [true, type];
    } else {
      return [
        false,
        "Emergency type does not exist, It is null or has been deleted",
      ];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

const getAllEmergencyTypes = async () => {
  try {
    const types = await EmergencyType.find({});

    if (types !== null) {
      return [true, types];
    } else {
      return [false, "No emergency types found"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};
module.exports = {
  createEmergencyType,
  deleteEmergencyType,
  updateEmergencyType,
  getAllEmergencyTypes,
  saveAllEmergencyTypes,
  getEmergencyByType,
  getEmergencyTypeById,
};
