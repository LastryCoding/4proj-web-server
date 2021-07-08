const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ItemSchema = require("./items").schema;

const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      item: { type: ItemSchema, required: false },
      quantity: { type: Number, required: false },
    },
  ],
});

module.exports = mongoose.model("cart", CartSchema);
