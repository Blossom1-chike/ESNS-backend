require("dotenv").config();
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { translateError } = require("./mongo_helper");
const { encryptPassword } = require("../helpers/encryptPassword");

/**Function to create a new user */
const createUser = async ({
  firstname,
  lastname,
  username,
  phone,
  email,
  password,
  verified,
  contacts,
  credentials,
}) => {
  try {
    console.log(credentials);
    //create user object
    let user = new User({
      firstname,
      lastname,
      username,
      phone,
      email,
      password: await encryptPassword(password),
      verified,
      contacts,
    });

    //create token for user
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY
    );

    //assign token to user
    user.token = token;

    //save user into database
    if (await user.save()) {
      return [true, user];
    }
  } catch (error) {
    console.log(error);
    return [false, translateError(error)];
  }
};

/**Function to authenticate a user when logging in */
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    return [true, user];
  } else {
    return [false, "Incorrect email/password"];
  }
};

/**Function to get a user by email */
const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (user !== null) {
    return [true, user];
  } else {
    return [false, "User with this email does not exist"];
  }
};

/**Function to get a user by id */
const getUserById = async (id) => {
  const user = await User.findOne(id);
  if (user !== null) {
    return [true, user];
  } else {
    return [false, "User does not exist, it is null or it has been deleted"];
  }
};

const authenticateUserPassword = async (email, password) => {
  const user = await User.findOne({ email });
  console.log(user, "password");

  if (user && (await bcrypt.compare(password, user.password))) {
    return [true, user];
  } else {
    return [false, "Incorrect email/password"];
  }
};

const updateUser = async (id, fields) => {
  console.log(id, fields,"things to update")
  try {
    const user = await User.findByIdAndUpdate(id, fields, { new: true });
    console.log(user, "User found to update");
    if(user !== null){
        return [true, user]
    }else{
        return [false, "User doesn't exist. User is null and/or has been deleted.", "Something went wrong."];
    }
  } catch (error) {
    return [false, translateError(error)]
  }
};

const updateUserPassword = async(id, password) => {
    try {
      const userWithPassword = await Admin.findByIdAndUpdate(id, {password: await encryptPassword(password)}, {new: true});
      if(userWithPassword !== null) {
          return [true, userWithPassword];
      } else {
          return [false, "User with ID and Password does not exist. User is null and/or has been deleted,", "Something went wrong."]
      }
  
    } catch (error) {
        console.log(error);
        return [false, translateError(error), "Something went wrong"]  
    }
  }

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  loginUser,
  authenticateUserPassword,
  updateUser,
  updateUserPassword
};
