const mongoose = require("mongoose");
const ItemSchema = require("./items").schema;
const Schema = mongoose.Schema;

const TransactionsSchema = new Schema({
  lineNumber: {
    type: Number,
    required: true,
  },
  items: {
    type: [ItemSchema],
    required: false,
  },
});

module.exports = mongoose.model("transactions", TransactionsSchema);
