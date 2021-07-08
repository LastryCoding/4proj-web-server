const mongoose = require("mongoose");
const ItemSchema = require("./items").schema;
const Schema = mongoose.Schema;

const ItemClientSchema = new Schema({
  item: {
    type: ItemSchema,
    required: false,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
  },
  userId: {
    type: String,
  },
});

module.exports = mongoose.model("ItemsClient", ItemClientSchema);
