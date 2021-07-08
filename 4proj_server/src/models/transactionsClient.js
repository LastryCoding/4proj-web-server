const mongoose = require("mongoose");
const ItemClientSchema = require("./itemsClient").schema;
const Schema = mongoose.Schema;

const TransactionsClientSchema = new Schema({
  items: {
    type: [ItemClientSchema],
    required: false,
  },
  userId: {
    type: String,
  },
  price: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("TransactionsClient", TransactionsClientSchema);
