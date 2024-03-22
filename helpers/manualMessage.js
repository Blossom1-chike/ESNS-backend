const { africastalking } = require("../database/config");
const Africastalking = require("africastalking")(africastalking);

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = require("twilio")(accountSid, authToken);

const sendManualEmergency = async ({ latitude, longitude, type }) => {
  const location = `https://www.google.com/maps/search/${latitude},${longitude}/`;
  const defaultContact = type?.defaultContact;

  try {
    const result = Africastalking.SMS
      .send({
        to: defaultContact,
        message: `There is an ${type?.type} emergency! Check location at ${location}`,
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(result);
  } catch (ex) {
    console.error(ex);
  }

  // client.messages
  //   .create({
  //     body: `There is an ${type?.type} emergency! Check location at ${location}`,
  //     from: phoneNumber,
  //     to: defaultContact,
  //   })
  //   .then((message) => {
  //     console.log(message);
  //     messages.push({ message: message.sid });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     messages.push({ error: err });
  //   });

  // return messages;
};
module.exports = sendManualEmergency;
