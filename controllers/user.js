require("dotenv").config();
const express = require("express");
const router = express.Router();
const {
  signUpValidator,
  validate,
  loginValidator,
  updatePasswordValidator,
  updateUserValidator,
} = require("../services/validation");
const {
  createUser,
  authenticateUserPassword,
  getUserById,
  updateUser,
} = require("../services/user");
const { translateError } = require("../services/mongo_helper");
const sendEmergencyMessage = require("../helpers/sendMessage");

router.post("/signup", signUpValidator(), validate, async (req, res) => {
  try {
    let { firstname, lastname, username, phone, email, password, credentials } =
      req.body;
    console.log("Request body: ", req.body);

    username = username === undefined ? firstname : username;
    const splitCredential = credentials.trim().split(" ");

    console.log(splitCredential, "Split credentials");

    const contacts = [];

    for (let i in splitCredential) {
      if(splitCredential[i].includes("+")){
        console.log(splitCredential[i], "crednetials")
        const detail = {
          name: splitCredential[i].split("+")[0],
          phone: splitCredential[i].split("+")[2],
        };
        console.log(detail, "Details", splitCredential[i].split("+")[0], splitCredential[i].split("+"), "values")
        contacts.push(detail);
      }
    }
    console.log("Contacts: omo ", contacts);

    let user = await createUser({
      firstname,
      lastname,
      username,
      phone,
      email,
      password,
      contacts,
    });

    console.log("New user created: ", user);

    user = user[1];

    res.cookie("authToken", user.token, {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 60,
      httpOnly: true,
    });

    user.token = undefined;
    user.createdAt = undefined;
    user.updatedAt = undefined;

    console.log("User after removing details: ", user);
    return res
      .status(200)
      .json({
        message: "New User created successfully",
        note: "Check email address to verify your account",
        status: "OK",
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something Went wrong",
      actualError: translateError(error),
      status: "NOT OK",
    });
  }
});

router.post("/login", loginValidator(), async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await authenticateUserPassword(email, password);

    if (user[0] === true) {
      res.cookie("authCookie", user.token, {
        secure: process.env.NODE_ENV === "development",
        maxAge: 1000 * 60 * 60 * 24 * 60,
        httpOnly: true,
      });

      user[1].token = undefined;
      user[1].createdAt = undefined;
      user[1].updatedAt = undefined;

      let userLogged = user[1];

      return res
        .status(200)
        .json({ message: "User login successful", userLogged });
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: user[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
});

router.post("/user/sendNotification", async (req, res) => {
  try {
    const { latitude, longitude, id } = req.body;

    const user = await getUserById({ _id: id });

    // console.log(user)

    if (user[0] === true) {
      if (latitude && longitude) {
        const result = sendEmergencyMessage({
          latitude,
          longitude,
          user: user[1],
        });
        console.log(result);
        return res.status(200);
      } else {
        return res.status(400).json({
          error: "Something went wrong",
          actualError: "Latitude and Longitude not defined",
          status: "NOT OK",
        });
      }
    } else {
      return res.status(400).json({
        error: "Something went wrong",
        actualError: user[1],
        status: "NOT OK",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
});

router.get("/logout", (req, res) => {
  try {
    res.clearCookie("authToken");
    return res.json({ message: "Logout Successful" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
});

router.put("/user/editPersonalInfo/:id", updateUserValidator(), async(req, res) => {
  try {
    console.log("Body: ", req.body)
    const {id} = req.params;
    console.log(id)
    let {firstname, lastname, phone} = req.body;

    let updatedUser = await updateUser(id, {firstname, lastname, phone});
    console.log("updated user: ", updatedUser);

    if(updatedUser[0] !== false){
      let user = updatedUser[1]
      user.password = undefined;
      user.token = undefined;
      user.createdAt = undefined;
      user.__v = undefined;

      console.log("User to be sent: ", user);
      return res.json({message: "User updates successfully", data: user, status:"OK"})
    }else{
      console.log(updatedUser, "Else statement")
      return res.status(400).json({error: updatedUser[2], actualError: updatedUser[1], status: "NOT OK"});
    }
  } catch (error) {
    console.log(error, "error")
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
})

router.put("/user/editPassword/:id", updatePasswordValidator(), validate, async(req, res) => {
  try {
    const {id} = req.params;
    const {confirmPassword} = req.body;

    const updatedUserPassword = await updatedUserPassword(id, confirmPassword);
    console.log("Updated user password: ", updatedUserPassword);

    if(updatedUserPassword[0] !== false){
      res.json({message:"Password updated successfully", status:"OK"})
    }else{
      return res.status(400).json({error: updatedUserPassword[2], actualError: updatedUserPassword[1], status:"NOT OK" })
    }
  } catch (error) {
    return res.status(400).json({
      error: "Something went wrong",
      actualError: error,
      status: "NOT OK",
    });
  }
})

module.exports = router;


