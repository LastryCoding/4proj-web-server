const mongoose = require("mongoose");

// Database Connection

const connectDB = async () => {
  await mongoose.connect("URI DATABASE", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  // console.log(`MongoDB Connected successfully: ${connection.connection.host}`);
  console.log(`MongoDB Connected successfully!`);
};

module.exports = connectDB;
