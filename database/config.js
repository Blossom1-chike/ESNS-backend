require("dotenv").config();

const africastalking = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: "Chinanu",
};

const mongoose = require("mongoose");
const { MONGODB_URI } = process.env;

const connectToDB = async () => {
    await mongoose.connect(
        MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    ).then(() => {
        console.log(`Database connected successfully at ${MONGODB_URI}`);
    }).catch((error) => {
        console.log("Error while connecting with database: ", error);
        throw new Error(error);
    })
};

const closeConnectionToDB = () => {
    return mongoose.disconnect();
}

module.exports = {
    africastalking,
    connectToDB,
    closeConnectionToDB
}