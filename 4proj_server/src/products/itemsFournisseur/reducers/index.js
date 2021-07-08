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
  if (data.item) {
    content.item = data.item;
  }
  if (!isEmpty(data.userId.trim())) {
    content.userId = data.userId;
  }
  if (!isNaN(data.quantity)) {
    content.quantity = data.quantity;
  }
  if (!isNaN(data.price)) {
    content.price = data.price;
  }

  return content;
};
