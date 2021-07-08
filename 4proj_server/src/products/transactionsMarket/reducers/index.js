//Validator
const isEmpty = (string) => {
  string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.userId)) errors.userId = "Must not be empty";

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
  if (!isEmpty(data.userId.trim())) {
    content.userId = data.userId;
  }

  return content;
};
