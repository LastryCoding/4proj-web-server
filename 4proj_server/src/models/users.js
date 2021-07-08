const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: false,
    default: 2000,
  },
  role: {
    type: String,
    required: false,
    default: "CLIENT",
  },
});

module.exports = mongoose.model("Users", userSchema);
