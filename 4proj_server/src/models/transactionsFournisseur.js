const mongoose = require("mongoose");
const ItemFournisseurSchema = require("./itemsFournisseur").schema;
const Schema = mongoose.Schema;

const TransactionFournisseurSchema = new Schema({
  items: {
    type: [ItemFournisseurSchema],
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

module.exports = mongoose.model("TransactionsFournisseur", TransactionFournisseurSchema);
