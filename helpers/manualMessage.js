require("dotenv").config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

const sendManualEmergency = async ({ latitude, longitude, type }) => {
  const location = `https://www.google.com/maps/search/${latitude},${longitude}/`;

  const defaultContact = type?.defaultContact;

  console.log(defaultContact, type, location);

  let messages = [];

  client.messages
    .create({
      body: `There is an ${type?.type} emergency! Check location at ${location}`,
      from: phoneNumber,
      to: defaultContact,
    })
    .then((message) => {
      console.log(message);
      messages.push({ message: message.sid });
    })
    .catch((err) => {
      console.log(err);
      messages.push({ error: err });
    });

  return messages;
};
module.exports = sendManualEmergency;
