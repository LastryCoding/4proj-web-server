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

exports.reduceData = (data) => {
  let content = {
    userId: "",
    items: [],
  };
  if (!isEmpty(data.userId.trim())) {
    content.userId = data.userId;
  }
  if (data.item && data.quantityAsked) {
    let thisItem = {
      item: data.item,
      quantity: data.quantityAsked,
    };
    content.items.push(thisItem);
  }

  return content;
};

exports.joinCarts = (data, cart) => {
  let theItem = this.reduceData(data).items[0];
  let bool = false;
  for (let i = 0; i < cart.items.length; i++) {
    let element = cart.items[i];
    if (theItem.item._id.toString() === element.item._id.toString()) {
      bool = true;
      element.quantity = parseInt(element.quantity) + parseInt(theItem.quantity);
    }
  }
  if (!bool) {
    cart.items.push(theItem);
  }

  return cart;
};
