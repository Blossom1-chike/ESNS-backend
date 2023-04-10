require("dotenv").config();
const EmergencyType = require('../model/type');

const createEmergencyType = async (body) => {
    try {
        const newType = new EmergencyType(body);

        if(await newType.save()){
            return [true, newType]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const getEmergencyByType = async (type) => {
    try {
        const data = await EmergencyType.findOne({type});
        if(type !== null){
            return [true, data]
        }else{
            return [false, "Type does not exist, or type is null"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const getEmergencyTypeById = async (id) => {
    try {
        const type = await EmergencyType.findOne(id);
        console.log(type);

        if(type){
            return [true, type]
        }else{
            return [false, "Emergency type not found"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const saveAllEmergencyTypes = async(data) => {
    try {
        const all = await EmergencyType.insertMany(data, {ordered: true});

        console.log(all)

        if(all){
            return [true, all]
        }else{
            return [false, "Something went wrong, cannot create all emergencies"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const deleteEmergencyType = async (id) => {
    try {
        const deletedType = await EmergencyType.findOneAndDelete(id);
        if(deletedType){
            return [true, deletedType]
        }else{
            return [false, "Emergency type does not exist, It is null or has been deleted"] 
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)] 
    }
}

const updateEmergencyType = async(id, fields) => {
    try {
        const type = await EmergencyType.findByIdAndUpdate(id, fields, {new: true});
        console.log(type, "Emergency type found!");

        if(type !== null){
            return [true, type]
        }else{
            return [false, "Emergency type does not exist, It is null or has been deleted"]
        }

    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const getAllEmergencyTypes = async() => {
    try {
        const types = await EmergencyType.find({});
        console.log(types, "All types");

        if(types !== null){
            return [true, types]
        }else{
            return [false, "No emergency types found"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}
module.exports = {
    createEmergencyType,
    deleteEmergencyType,
    updateEmergencyType,
    getAllEmergencyTypes,
    saveAllEmergencyTypes,
    getEmergencyByType,
    getEmergencyTypeById
}