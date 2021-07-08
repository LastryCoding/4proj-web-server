const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  lineNumber: {
    type: Number,
    required: true,
  },
  labels: {
    type: String,
    required: true,
  },
  level1: {
    type: String,
    required: true,
  },
  level2: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: false,
  },
  freq: {
    type: Number,
    required: false,
  },
  coefPrice: {
    type: Number,
    required: false,
  },
  datePeremption: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("items", ItemSchema);
