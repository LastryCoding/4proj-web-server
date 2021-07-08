const app = require("express")();
const cart = require("./cart/routes");
const shelves = require("./shelveMarket/routes");
const notif = require("./notifications/routes");
const items = require("./items/routes");
const recosys = require("./recosys/routes");
const itemsClient = require("./itemsClient/routes");
const itemsMarket = require("./itemsMarket/routes");
const itemsFournisseur = require("./itemsFournisseur/routes");
const transactions = require("./transactions/routes");
const transactionsClient = require("./transactionsClient/routes");
const transactionsMarket = require("./transactionsMarket/routes");
const transactionsFournisseur = require("./transactionsFournisseur/routes");

app.use("/cart", cart);
app.use("/notif", notif);
app.use("/items", items);
app.use("/shelves", shelves);
app.use("/recosys", recosys);
app.use("/itemsClient", itemsClient);
app.use("/itemsMarket", itemsMarket);
app.use("/itemsFournisseur", itemsFournisseur);
app.use("/transactions", transactions);
app.use("/transactionsClient", transactionsClient);
app.use("/transactionsMarket", transactionsMarket);
app.use("/transactionsFournisseur", transactionsFournisseur);

module.exports = app;
