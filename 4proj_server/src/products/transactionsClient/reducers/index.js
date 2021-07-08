//Validator
const isEmpty = (string) => {
  string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.labels)) errors.clientId = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceData = (data) => {
  let content = {};
  if (data.items) {
    content.items = data.items;
  }
  if (!isEmpty(data.clientId.trim())) {
    content.clientId = data.clientId;
  }

  return content;
};
