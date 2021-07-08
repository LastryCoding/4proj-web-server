const mongoose = require("mongoose");
const ItemSchema = require("./items").schema;
const Schema = mongoose.Schema;

const ItemMarketSchema = new Schema({
  item: {
    type: ItemSchema,
    required: false,
  },
  quantity: {
    type: Number,
    default: 1000,
  },
  price: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

module.exports = mongoose.model("ItemsMarket", ItemMarketSchema);
