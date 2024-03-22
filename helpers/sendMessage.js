const { africastalking } = require("../database/config");

const Africastalking = require("africastalking")(africastalking);

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
// const client = require("twilio")(accountSid, authToken);

const sendEmergencyMessage = ({ latitude, longitude, user }) => {
  const location = `https://www.google.com/maps/search/${latitude},${longitude}/`;

  try {
    const result = Africastalking.SMS
      .send({
        to: user.contacts?.map((x) => x?.phone),
        message: `Help!, it is ${
          user.firstname + " " + user.lastname
        }, I am in danger. \nMy current location is ${location}`,
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

  // for (let i in contacts) {
  //   client.messages
  //     .create({
  //       body: `Help!, it is ${
  //         user.firstname + " " + user.lastname
  //       }, I am in danger. \nMy current location is ${location}`,
  //       from: phoneNumber,
  //       to: "+2348162385297",
  //     })
  //     .then((message) => {
  //       console.log(message);
  //       messages.push({ message: message.sid });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       messages.push({ error: err });
  //     });
  // }

  // return messages;
};
module.exports = sendEmergencyMessage;
