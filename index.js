require("dotenv").config(); //Loads all environment variables to be used in the project from process.env file
const express = require("express");
const cors = require("cors");
const { connectToDB } = require("./database/config.js");
const app = express();
const cookieParser = require("cookie-parser");
const http = require("http");

const PORT = process.env.SERVER_PORT || process.env.PORT || 4000;

const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://esns-frontend-6b1l2ytol-blossom1-chike.vercel.app",
    "https://esns-frontend-gslorg805-blossom1-chike.vercel.app",
    "https://esns-frontend-blossom1-chike.vercel.app",
    "https://esns-frontend-git-main-blossom1-chike.vercel.app",
    "https://esns-frontend-ashen.vercel.app"
  ],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// app.use(function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

//To allow CORS
app.use(cors(corsOptions));

//To allow json requests and to decode requests from forms
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//To allow cookies
app.use(cookieParser());

//Server creation and database setup
const server = http.createServer(app);

connectToDB()
  .then(() => {
    //Start listening to the server at port assigned
    server.listen(PORT, () => {
      console.log("Server listening at port: ", PORT);
    });
  })
  .catch(() => {
    console.log("Error occured while connecting to database: ");
  });

//Routes
app.use("/api", require("./controllers/user"));
app.use("/api", require("./controllers/type"));
app.use("/api", require("./controllers/history"));
app.use("/api/admin", require("./controllers/admin")); //Admin route

//When a route is non-existent
app.use("*", (req, res) => {
  res.status(404).send({ error: "Route does exist" });
});
//Any error occured in starting the server
server.on("error", (err) => {
  console.log("Error occured while starting server: ", err);
  process.exit(1);
});
