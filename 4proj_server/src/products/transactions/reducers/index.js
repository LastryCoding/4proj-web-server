const { reduceData } = require("../../items/reducers");

//Validator
const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isNaN(data.lineNumber)) errors.lineNumber = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceData = (data) => {
  let content = {};
  let items = [];
  if (!isNaN(data.lineNumber)) {
    content.lineNumber = data.lineNumber;
  }
  if (data.items.length > 0) {
    for (let i = 0; i < data.items.length; i++) {
      const element = data.items[i];
      items.push(reduceData(element));
    }
  }
  content.items = items;
  return content;
};
