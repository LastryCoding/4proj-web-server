//Validator
const isEmpty = (string) => {
  string.trim() === "";
};

exports.validateData = (data) => {
  let errors = {};
  if (isEmpty(data.name)) errors.name = "Must not be empty";
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
  if (data.items) {
    content.items = data.items;
  }
  if (!isEmpty(data.name.trim())) {
    content.name = data.name;
  }
  if (!isEmpty(data.userId.trim())) {
    content.userId = data.userId;
  }
  if (Object.keys(data).includes("sensor")) {
    content.sensor = data.sensor;
  }
  if (Object.keys(data).includes("alertDate")) {
    content.alertDate = data.alertDate;
  }
  if (Object.keys(data).includes("alertQuantity")) {
    content.alertQuantity = data.alertQuantity;
  }

  return content;
};

exports.uniqueCategories = (data) => {
  let uniqueCategories = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (!uniqueCategories.includes(element.item.level1)) {
      uniqueCategories.push(element.item.level1);
    }
  }
  return uniqueCategories;
};

exports.getOnlyOneCategorieOfList = (categorie, data) => {
  let newCategorieList = [];
  for (let i = 0; i < data.length; i++) {
    const element = data[i];
    if (element.item.level1 === categorie) {
      newCategorieList.push(element);
    }
  }
  return newCategorieList;
};
