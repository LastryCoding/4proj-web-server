//Validator
const isEmpty = (string) => {
  return string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.labels)) errors.labels = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceData = (data) => {
  let content = {};
  if (!isEmpty(data.labels.trim())) {
    content.labels = data.labels;
  }
  if (!isEmpty(data.level1.trim())) {
    content.level1 = data.level1;
  }
  if (!isEmpty(data.level2.trim())) {
    content.level2 = data.level2;
  }
  if (!isNaN(data.lineNumber)) {
    content.lineNumber = data.lineNumber;
  }
  if (!isNaN(data.count)) {
    content.count = data.count;
  }
  if (!isNaN(data.freq)) {
    content.freq = data.freq;
  }
  if (!isNaN(data.coefPrice)) {
    content.coefPrice = data.coefPrice;
  }
  if (!isNaN(data.datePeremption)) {
    content.datePeremption = data.datePeremption;
  }

  return content;
};
