//Validator
const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.email)) errors.email = "Must not be empty";
  if (isEmpty(data.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceData = (data) => {
  let content = {};
  if (!isEmpty(data.email.trim())) {
    content.email = data.email;
  }
  if (!isEmpty(data.password.trim())) {
    content.password = data.password;
  }
  if (data.fullName && !isEmpty(data.fullName.trim())) {
    content.fullName = data.fullName;
  }
  if (data.role && !isEmpty(data.role.trim())) {
    content.role = data.role;
  }
  if (!isNaN(parseFloat(data.money))) {
    content.money = parseFloat(data.money);
  }

  return content;
};
