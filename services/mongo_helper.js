const toSentenceCase = (str) => str.charAt(0).toUpperCase + str.substr(1);

const translateError = (err) => {
  const errors = [];
  if (!err.code && !err.errors) {
    errors.push(err.message);
  } else if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    errors.push(toSentenceCase(`${field} already exists.`));
  } else {
    Object.keys(err.errors).map((field) => {
      let msg = err.errors[field].message;
      errors.push(toSentenceCase(msg.replace("Path ", "").replace(/`/g, "")));
    });
  }
  return errors;
};
module.exports = { translateError };
