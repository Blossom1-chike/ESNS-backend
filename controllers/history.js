require('dotenv').config();
const express = require('express');
const { addEmergencyHistory } = require('../services/history');
const router = express.Router();

router.post("/add-emergency-history", async(req, res) => {
    try {
        const emergencyHistory = await addEmergencyHistory(req.body);

        if(emergencyHistory[0] !== false){
            console.log("History added: ", emergencyHistory[1]);
            res.json({message: "Emergency sent successfully!", status: "OK"})
        }else{
            return res.status(400).json({error: "Something went wrong.", actualError: emergencyHistory[1], status: "NOT OK" });
        }
    } catch (error) {
        return res.status(400).json({error: "Something went wrong", actualError: error, status: "NOT OK"})
    }
});

module.exports = router;