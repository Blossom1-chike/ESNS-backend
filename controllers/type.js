require('dotenv').config();
const express = require('express');
const { createEmergencyType, deleteEmergencyType, getAllEmergencyTypes, saveAllEmergencyTypes, getEmergencyTypeById } = require('../services/type');
const { emergencyTypeValidator, validate } = require('../services/validation');
const router = express.Router();

router.post("/add-emergency-type", emergencyTypeValidator(), validate, async(req, res) => {
    try {
        // let {type, color, defaultContact} = req.body;
        console.log("Request body: ", req.body.types);
    
        let emergencytype = await saveAllEmergencyTypes(req.body.types);
    
        if(emergencytype[0] !== false){
            console.log("Created type: ", emergencytype[1])
            res.json({message: "Emergency type created successfully", status: "OK"})
        } else {
            return res.status(400).json({error: "Something went wrong.", actualError: emergencytype[1], status: "NOT OK" });
        }
    
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }   
})

router.delete("/delete-emergency-type/:id", async (req, res) => {
    try {
        const {id} = req.params;

        const deletedType = await deleteEmergencyType(id);
        if(deletedType[0] !== false){
            res.json({message: "Emergency type deleted successfully", status: "OK"})
        }else{
            res.status(400).json({error: "Something went wrong.", actualError: emergencytype[1], status: "NOT OK"})
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
})

router.put("/emergency-type/:id", async(req, res) => {
    try {
        const {id} = req.params;

        const type = await getEmergencyTypeById(id);
    } catch (error) {
        
    }
})
router.get("/emergency-types", async (req, res) => {
    try {
       const allTypes = await getAllEmergencyTypes();
       
        if(allTypes[0] !== false){
            res.json({message: "All emergency types returned successfully", status: "OK", types: allTypes[1]})
        }else{
            res.status(400).json({error: "Something went wrong.", actualError: allTypes[1], status: "NOT OK"})
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
})
module.exports = router;