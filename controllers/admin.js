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

        
        let {firstname, lastname, username, email, password} = req.body;
        let admin = await createAdmin({firstname, lastname, username, email, password});

      
        if(admin[0] !== false){
            
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
        let adminExists = await authenticateAdmin(email, password);
       

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

          
            res.status(200).json({message: "Admin Login successful", status:"OK", admin})
        }
        else{
            return res.status(400).json({error: "Something went wrong", actualError: adminExists[1], status:"NOT OK"});
        }
    } catch (error) {       //Catch block isn't needed as the Else block would handle the error if it isn't already handled by our middlewares
       
        return res.status(400).json({error: "Something went wrong" });
        
    }
})

// Edit Admin Details
router.put('/editProfile/:id', isAdmin, updateAdminValidator, validate, async (req, res) => {
    try{

        const { id } = req.params;
        let { firstname, lastname, username, email } = req.body;

        let check = await updateAdmin(id, {firstname, lastname, username, email});
   
        if(check[0] !== false) {
            let admin = check[1];
            admin.password = undefined;
            admin.token = undefined;
            admin.createdAt = undefined;
            admin.updatedAt = undefined;
            admin.__v = undefined;
            
           
            return res.json({message: "Admin details updated successfully ", status: "OK", admin});
        } else {
            return res.status(400).json({error: check[2], actualError: check[1], status: "NOT OK"});
        }
        
    }
    catch(error) {
       
        return res.status(400).json({error: "Something went wrong", actualError:translateError(error), status:"NOT OK" });
        
    }
    
})

router.put('/editProfile/password/:id', isAdmin, updatePasswordValidator, validate, async (req, res) => {

    const {id} = req.params;


    const { confirmNewPassword } = req.body;
   
    const tryUpdate = await updateAdminPassword(id, confirmNewPassword)
 
    if(tryUpdate[0] !== false) {
        res.json({message: "Password updated successfully", status: "OK"})
    } else {
        return res.status(400).json({error: tryUpdate[2], actualError: tryUpdate[1], status:"NOT OK" })
        
    }
})

module.exports = router;