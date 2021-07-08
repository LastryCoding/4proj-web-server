const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db")();
var MongoDBStore = require("connect-mongodb-session")(session);
const app = express();

var store = new MongoDBStore({
  uri: "mongodb+srv://dbUser:yEzdkmuY208lGXwo@recomsys.3gnje.mongodb.net/ItemsAndTransanctions?retryWrites=true&w=majority",
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(express.json());
app.use(
  session({
    name: "COOKIE_NAME",
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
      httpOnly: true,
      sameSite: "lax", // csrf
      // secure: __prod__, // cookie only works in https
      secure: false, // cookie only works in https
    },
    saveUninitialized: false,
    secret: "process.env.SESSION_SECRET",
    resave: false,
  })
);

const helmet = require("helmet");
app.use(
  cors({
    credentials: true,
    origin: ["https://4proj.netlify.app","http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(helmet());

// ROUTES
app.use("/products", require("./products"));
app.use("/auth", require("./authentication/routes"));

const PORT = 3333;
app.listen(process.env.PORT || PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
