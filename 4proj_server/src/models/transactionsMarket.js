const mongoose = require("mongoose");
const ItemMarketSchema = require("./itemsMarket").schema;
const Schema = mongoose.Schema;

const TransactionMarketSchema = new Schema({
  items: {
    type: [ItemMarketSchema],
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

module.exports = mongoose.model("TransactionsMarket", TransactionMarketSchema);
