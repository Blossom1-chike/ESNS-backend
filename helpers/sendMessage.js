require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

const sendEmergencyMessage = ({ latitude, longitude, user }) => {

  const location = `https://www.google.com/maps/search/${latitude},${longitude}/`;

  const contacts = user.contacts;

  let messages = [];

  for (let i in contacts) {
    client.messages
      .create({
        body: `Help!, it is ${
          user.firstname + " " + user.lastname
        }, I am in danger. \nMy current location is ${location}`,
        from: phoneNumber,
        to: "+2348162385297",
      })
      .then((message) => {
        console.log(message);
        messages.push({ message: message.sid });
      })
      .catch((err) => {
        console.log(err);
        messages.push({ error: err });
      });
  }

  return messages;
};
module.exports = sendEmergencyMessage;
