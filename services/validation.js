const { check, body, validationResult } = require("express-validator");
const {
  getUserByEmail,
  getUserById,
  authenticateUserPassword,
} = require("../services/user");
const { getAdminByEmail } = require("./admin");
const { getEmergencyByType } = require("./type");

const signUpValidator = () => {
  return [
    check("email")
      .custom(async (value) => {
        let userExists = await getUserByEmail(value);
        if (userExists[0] === true) {
          return Promise.reject();
        }
      })
      .withMessage(
        "Email is taken already, login if such email belongs to you"
      ),
    body("firstname", "First name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("email", "Email must be valid containing @ and a domain (e.g .com)")
      .isEmail()
      .isLength({ min: 10 }),
    body("email", "Email is required").trim().notEmpty(),
    body("phone", "Phone number is required")
      .trim()
      .notEmpty()
      .isLength({ min: 11 }),
    body("password", "Password is required").trim().notEmpty(),
    body("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be at least 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
    // body("contacts", "Contacts are required").trim().notEmpty(),
  ];
};

const emergencyTypeValidator= () => {
  return[
    check("type").custom(async (value) => {
      let type = await getEmergencyByType(value);
      if(type[0] == null){
        return Promise.reject();
      }
    }).withMessage("Such emergency type exists already"),
    body("label", "Emergency Label is required"),
    body("defaultContact", "Default Contact is required"),
  ]
}

const loginValidator = () => {
console.log("validaion file")
  return [
    body("email", "Email is required").trim().notEmpty(),
    body("password", "Password is required").trim().notEmpty(),
  ];
};

const updateUserValidator = () => {
  return [
    body("firstname", "First Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    body("lastname", "Last Name is required")
      .trim()
      .notEmpty()
      .isLength({ min: 3 }),
    // body("username", "User Name is required")
    //   .trim()
    //   .notEmpty()
    //   .isLength({ min: 3 }),
    body("phone", "Phone Number is required")
      .trim()
      .notEmpty()
      .isLength({ min: 11 }),
  ];
};

const updatePasswordValidator = () => {
  return [
    body("currentPassword", "Please enter current password").trim().notEmpty(),
    check("currentPassword")
      .custom(async (value, { req }) => {
        const { id } = req.params;
        const user = await getUserById(id);

        let isMatched = await authenticateUserPassword(user.email, value);
        if (isMatched[0] == false) {
          return Promise.reject();
        }
      })
      .withMessage("Current password is incorrect"),
    body("newPassword", "New password is required").trim().notEmpty(),
    body("newPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be at least 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
    body("confirmPassword", "Please confirm new password").trim().notEmpty(),
    body("confirmPassword")
      .custom(async (value, { req }) => {
        const { newPassword } = req.body;
        if (value === newPassword) {
          console.log("Passwords match");
          return true;
        } else {
          console.log("Passwords don't match");
          return false;
        }
      })
      .withMessage("Passwords must match"),
    body("confirmPassword")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage(
        "Password must be at least 8 characters long and a combination of at least one upper and lower case letter and one number."
      ),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push(err.msg));
  return res.status(400).json({
    errors: extractedErrors,
  });
};

const adminSignupValidator = () => {
  return [
    //Check that email isn't taken
    check("email").custom(async(value) => {
      let adminExist = await getAdminByEmail(value);
      console.log("Exists? ", adminExist)
      if(adminExist[0]!==false) {
        console.log("The Admin already exists");
       return Promise.reject()
      }
    
    }).withMessage("Email is taken! If it belongs to you, please login!"),
     
    //First name and lastname is not null and is between 4-10 characters
    body("firstname", "First Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("lastname", "Last Name is required").trim().notEmpty().isLength({ min: 3 }),
    //Email validation
    body("email", "Email is required").trim().notEmpty(),
    body("email", "Email must be valid containing @ and a domain (e.g .com)").isEmail().isLength({ min: 10 }),
    //Password validation
    body("password", "Password is required").trim().notEmpty(),
    body("confirmPassword", "Please enter your password again").trim().notEmpty(),
    check("confirmPassword").custom((value, {req}) => {
      console.log("From Validator req body ", req.body);
      const { password } = req.body;
      if(value===password) {
        console.log("Passwords are the same.. Validation passed", value===password);
        return true;
      } else {
        console.log("Passwords must be the same.. Validation test failed", value===password);
        return Promise.reject()    //return false or return Promise.reject() would both work since this isn't an async function
      }
    }).withMessage("Passwords are not the same"),
    body("password")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
      .withMessage("Password must be at least 8 characters long and a combination of at least one upper and lower case letter and one number."),
  ];
};

const updateAdminValidator = () => {
  return [
    //Check that email isn't taken
      check("email").custom(async(value, {req}) => {
        const { id } = req.params;
        let adminExist = await getAdminByEmail(value);
        console.log("Exists? ", adminExist)
        if(adminExist[1]._id == id) {
          console.log("Admin's email didn't change. Still the same email for Admin. ", adminExist[1]._id == id);
        } 
        if(adminExist[0]!==false && adminExist[1]._id != id) {
        console.log("The Admin already exists");
        return Promise.reject()
      }      
    }).withMessage("Another Admin with that email already exists."),
         
    body("firstname", "First Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("lastname", "Last Name is required").trim().notEmpty().isLength({ min: 3 }),
    body("username", "Enter Admin Username").trim().notEmpty().isLength({min: 3}),
    body("email", "Email is required").notEmpty(),
    body("email")
      .isEmail()
      .withMessage("Email must be valid containing @ and a domain (e.g .com) ")
      .isLength({ min: 10 }),
  ]
}

module.exports = {
  signUpValidator,
  loginValidator,
  validate,
  updatePasswordValidator,
  updateUserValidator,
  adminSignupValidator,
  updateAdminValidator,
  emergencyTypeValidator
};
