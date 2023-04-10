require("dotenv").config();
const Admin = require("../model/admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { translateError } = require("./mongo_helper");
const { encryptPassword } = require("../helpers/encryptPassword");

const createAdmin = async ({ firstname, lastname, username, email, password, token, role}) => {
    try {
        const admin = new Admin({
            firstname, 
            lastname,
            username ,
            email, 
            password: await encryptPassword(password)
        })
        console.log("Admin: ", admin);
    
        const token = jwt.sign({id: admin._id, role: admin.role}, process.env.JWT_SECRET_KEY);
    
        admin.token = token;
    
        if(await admin.save()){
            return [true, admin];
        }
    
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const authenticateAdmin = async (email, password) => {
    try {
        const admin = await Admin.findOne({email});
        console.log(admin, "Found!")

        if(admin && await bcrypt.compare(password, admin.password)){
            return [true, admin]
        }else{
            return [false, "Incorrect email/password"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }   
}

const getAdminById = async (id) => {
    try {
        const admin = await Admin.findById(id);
        if(admin !== null){
            return [true, admin]
        }else{
            return [false, "No such admin exists, Admin is null and/or has been deleted"];
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const getAdminByEmail = async (email) => {
    try {
        const admin = await Admin.findOne({email});
        if(admin !== null){
            return [true, admin]
        }else{
            return [false, "No such admin with such email"];
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error)]
    }
}

const updateAdmin = async (id, fields) => {
    try {
        const admin = await Admin.findByIdAndUpdate(id, fields, {new: true});
        if(admin !== null){
            return [true, admin]
        }else{
            return [false, "No admin with such id found, Admin is null and/or has been deleted", "Somethin went wrong"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error), "Something went wrong"]
    }
}

const updateAdminPassword = async (id, password) => {
    try {
        const adminWithNewPassword = await Admin.findByIdAndUpdate(id, {password: encryptPassword(password)}, {new: true});
        if(adminWithNewPassword !== null){
            return [true, adminWithNewPassword]
        }else{
            return [false, "No admin with such id and password found, Admin is null and/or has been deleted", "Something went wrong"]
        }
    } catch (error) {
        console.log(error);
        return [false, translateError(error), "Something went wrong"]
    }
}
module.exports = {
    createAdmin,
    getAdminById,
    getAdminByEmail,
    updateAdmin,
    updateAdminPassword,
    authenticateAdmin
}
