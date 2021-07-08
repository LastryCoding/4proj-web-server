const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  day: {
    type: Number,
    required: false,
    default: 0,
  },
});

module.exports = mongoose.model("notification", NotificationSchema);
