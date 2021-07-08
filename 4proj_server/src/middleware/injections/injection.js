const ItemSchema = require("../../models/items");
const TransactionSchema = require("../../models/transactions");

const Parse = async (text) => {
  let listOfWords = [];
  for (let i = 0; i < text.length; i++) {
    const element = text[i];
    listOfWords.push(await Cutter(element));
  }
  return listOfWords;
};

const Cutter = async (element) => {
  const words = await element.split(",");
  return words;
};

const ReadTheFile = async (fileName) => {
  var fs = require("fs");
  var lines = [];
  try {
    var data = fs.readFileSync(fileName, "utf8");
    lines = data.split(/\r?\n/);
  } catch (e) {
    console.log("Error:", e.stack);
  }
  return lines;
};

const ManageItems = async (fileName) => {
  var resultat = await Parse(await ReadTheFile(fileName));
  for (let i = 0; i < resultat.length; i++) {
    const element = resultat[i];
    var newItem = new ItemSchema({
      lineNumber: parseInt(element[0]),
      labels: element[1],
      level1: element[3],
      level2: element[2],
    });
    await newItem
      .save()
      .then((response) => {
        if (response) {
          console.log(response);
        }
      })
      .catch((err) => {
        console.log("Oops, we're sorry but it appears that something went wrong.");
      });
  }
};

const ManageTransactions = async (fileName) => {
  var resultat = await Parse(await ReadTheFile(fileName));
  for (let i = 0; i < resultat.length; i++) {
    const element = resultat[i];
    var listOfItem = [];
    for (let j = 1; j < resultat[i].length; j++) {
      const item = element[j];
      await ItemSchema.findOne({ labels: item }).then((itemdb) => {
        listOfItem.push(itemdb);
      });
    }
    var newTransaction = new TransactionSchema({
      lineNumber: parseInt(element[0]),
      items: listOfItem,
    });
    await newTransaction
      .save()
      .then((response) => {
        if (response) {
          console.log("saved", newTransaction.lineNumber);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
