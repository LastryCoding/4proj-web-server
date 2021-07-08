//Validator
const isEmpty = (string) => {
  string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.labels)) errors.fournisseurId = "Must not be empty";

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
  if (!isEmpty(data.fournisseurId.trim())) {
    content.fournisseurId = data.fournisseurId;
  }

  return content;
};
