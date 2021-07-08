//Validator
const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateData = (cart) => {
  let errors = {};
  if (isEmpty(cart.userId)) errors.userId = "Must not be empty";
  if (cart.items.length < 0 || cart.items.length == 0) errors.items = "Cart must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceData = (cart) => {
  let content = {};
  if (cart.item) {
    content.item = cart.item;
  }
  if (!isEmpty(cart.clientId.trim())) {
    content.clientId = cart.clientId;
  }
  if (!isNaN(cart.quantity)) {
    content.quantity = cart.quantity;
  }
  if (!isNaN(cart.price)) {
    content.price = cart.price;
  }

  return content;
};
