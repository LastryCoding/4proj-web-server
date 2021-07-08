//Validator
const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.userId)) errors.userId = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
