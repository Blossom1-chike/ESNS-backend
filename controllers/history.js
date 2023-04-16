require('dotenv').config();
const express = require('express');
const { addEmergencyHistory, getHistoryByUser, getUserHistory } = require('../services/history');
const router = express.Router();

router.post("/add-emergency-history", async(req, res) => {
    try {
       
        const emergencyHistory = await addEmergencyHistory(req.body);

        if(emergencyHistory[0] !== false){
        
            res.json({message: "Emergency sent successfully!", status: "OK"})
        }else{
            return res.status(400).json({error: "Something went wrong.", actualError: emergencyHistory[1], status: "NOT OK" });
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
});

router.get("/user-emergency-history/:id", async(req, res) => {
   
    try {
        const {id} = req.params;
        const userHistories = await getHistoryByUser(id);
        
        if(userHistories[0] !== false){
            res.json({message: "All emergency types returned successfully", status: "OK", history: userHistories[1]})
        }else{
            res.status(400).json({error: "Something went wrong.", actualError: userHistories[1], status: "NOT OK"})
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
})
module.exports = router;