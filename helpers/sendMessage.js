require("dotenv").config();

const africastalking = {
  apiKey: process.env.AFRICASTALKING_API_KEY,
  username: "Chinanu",
};

const Africastalking = require("africastalking")(africastalking);

const sms = Africastalking.SMS;

const sendEmergencyMessage = ({ latitude, longitude, user }) => {
  const location = `https://www.google.com/maps/search/${latitude},${longitude}/`;
  console.log(user.contacts?.map((x) => x?.phone))
  try {
    const result = sms
      .send({
        to: user.contacts?.map((x) => `+${x?.phone}`),
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

    console.log(result, "my result");
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
