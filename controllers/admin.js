require('dotenv').config()
const express = require('express');
const { isAdmin } = require('../middleware/auth');
const { off, validate } = require('../model/user');
const { getAdminById, createAdmin, updateAdminPassword, updateAdmin, authenticateAdmin } = require('../services/admin');
const { adminSignupValidator, loginValidator, updateAdminValidator, updatePasswordValidator } = require('../services/validation');
const router = express.Router();

router.get("/user/:id", isAdmin, async (req, res) => {
    try {
        const {id} = req.params;
        const admin = await getAdminById(id);
        console.log("Admin = ", admin);
    
        if(admin[0] !== false){
            return [true, admin]
        }else{
            return res.status(400).json({error: 'Admin does not exist', actualError: admin[1], status: "NOT OK"})
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
});

router.post("/signup", isAdmin, adminSignupValidator(), validate, async(req,res) => {
    try {
        console.log('Admin request body: ', req.body);
        
        let {firstname, lastname, username, email, password} = req.body;
        let admin = await createAdmin({firstname, lastname, username, email, password});

        console.log("Created admin: ", admin);
        if(admin[0] !== false){
            console.log("The Admin created: ", admin[1]);
            res.json({message: "New Admin created successfully", status: "OK"})
        }else {
            return res.status(400).json({error: "Something went wrong.", actualError: admin[1], status: "NOT OK" });

        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
})

router.post('/login', loginValidator(), async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body,"Login body");
        let adminExists = await authenticateAdmin(email, password);
        console.log("The Admin Exists ", adminExists);

        if(adminExists[0]==true) {
            adminExists = adminExists[1];

            //Create token
            const token = adminExists.token;

            //Save token in a cookie and send back to the frontend
            res.cookie('authToken', token, {
                secure: process.env.NODE_ENV === "production",
                maxAge: 1000*60*60*24*60, //Cookie expires after 24hours of being logged in.. 1000 milliseconds * 60seconds * 60minutes *24 hours 
                httpOnly: true
            })

            const { _id, firstname, lastname, username, email, role } = adminExists;

            let admin = { _id, firstname, lastname, username, email, role};

            console.log("The logged in admin ", admin);
            res.status(200).json({message: "Admin Login successful", status:"OK", admin})
        }
        else{
            return res.status(400).json({error: "Something went wrong", actualError: adminExists[1], status:"NOT OK"});
        }
    } catch (error) {       //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
        console.log(error)
        return res.status(400).json({error: "Something went wrong" });
        
    }
})

// Edit Admin Details
router.put('/editProfile/:id', isAdmin, updateAdminValidator, validate, async (req, res) => {
    try{
        console.log("req body ", req.body);
        const { id } = req.params;
        let { firstname, lastname, username, email } = req.body;

        let check = await updateAdmin(id, {firstname, lastname, username, email});
        console.log("ADmin update ", check);
        if(check[0] !== false) {
            let admin = check[1];
            admin.password = undefined;
            admin.token = undefined;
            admin.createdAt = undefined;
            admin.updatedAt = undefined;
            admin.__v = undefined;
            
            console.log("Admin to be sent ", admin);
            return res.json({message: "Admin details updated successfully ", status: "OK", admin});
        } else {
            return res.status(400).json({error: check[2], actualError: check[1], status: "NOT OK"});
        }
        
    }
    catch(error) {
        console.log("Error ", error)
        return res.status(400).json({error: "Something went wrong", actualError:translateError(error), status:"NOT OK" });
        
    }
    
})

router.put('/editProfile/password/:id', isAdmin, updatePasswordValidator, validate, async (req, res) => {

    const {id} = req.params;
    console.log(req.body);

    const { confirmNewPassword } = req.body;
   
    const tryUpdate = await updateAdminPassword(id, confirmNewPassword)
    console.log("Edit Admin password  ", tryUpdate)
    if(tryUpdate[0] !== false) {
        res.json({message: "Password updated successfully", status: "OK"})
    } else {
        return res.status(400).json({error: tryUpdate[2], actualError: tryUpdate[1], status:"NOT OK" })
        
    }
})

module.exports = router;