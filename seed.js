//Seed file to create default admin user
require("dotenv").config();
const { createAdmin, getAdminByEmail } = require("./services/admin");
const { MONOGODB_URI } = process.env;

const mongoose = require("mongoose");
const { connectToDB } = require("./database/config");

// mongoose.connect(
//   MONOGODB_URI,
//   {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//   },
//   (err) => {
//     if (err) {
//       console.log("Error connecting to db: ", err);
//     }else{
//         console.log("Successfully connected to MongoDb @ ", MONOGODB_URI)
//     }
//   }
// );

connectToDB()
  .then(() => main())
  .catch((error) => console.log("Error connecting to db: ", error));

const main = async () => {
  try {
    let defaultAdmin = {
      firstname: "Default",
      lastname: "Admin",
      username: "Default Admin",
      email: "esnsDefault@gmail.com",
      password: "Password@@1",
    };

    const defaultAdminExists = await getAdminByEmail(defaultAdmin.email);
    if (defaultAdminExists[0] !== false) {
      console.log("Default Admin already exists");
      console.log(
        "Run 'npm run dev' or 'npm start' or 'npm run start' to run the main application server"
      );
      console.error("Connection closed");

      process.exit(1);
    } else {
      let admin = await createAdmin(defaultAdmin);
      console.log("Default Admin created successfully, ", admin);
      console.log(
        "Run 'npm run dev' or 'npm start' or 'npm run start' to run the main application server"
      );
      process.exit(1);
    }
  } catch (error) {
    console.log("Error from seeding: ", error);
  }
};

main();
