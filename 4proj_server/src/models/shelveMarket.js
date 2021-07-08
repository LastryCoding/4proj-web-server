const mongoose = require("mongoose");
const ItemMarketSchema = require("./itemsMarket").schema;
const Schema = mongoose.Schema;

const ShelveMarket = new Schema({
  items: {
    type: [ItemMarketSchema],
    required: false,
  },
  userId: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  sensor: {
    type: Boolean,
    required: false,
    default: false,
  },
  alertDate:{
    type: Boolean,
    required: false,
    default: false,
  },
  alertQuantity:{
    type: Boolean,
    required: false,
    default: false,
  }
});

module.exports = mongoose.model("shelveMarket", ShelveMarket);
