const { create, updateOne, readAll, readOne, deleteOne } = require("./../../../middleware/requests");
const { validateData, reduceData } = require("./../reducers");
const { switchStatus } = require("./../../../middleware/statusRes");
const ItemSchema = require("./../../../models/itemsMarket");
const itemsBase = require("./../../items/handlers");
const ItemMarketSchema = require("./../../../models/itemsMarket");
const ItemFournisseurSchema = require("./../../../models/itemsFournisseur");
const NotificationSchema = require("./../../../models/notification");
const TransactionMarketSchema = require("./../../../models/transactionsMarket");
const TransactionFournisseurSchema = require("./../../../models/transactionsFournisseur");
const handleReadAllItemFournisseur = require("./../../itemsFournisseur/handlers/index").handleReadAll;
const handleUpdateOneItemFournisseur = require("./../../itemsFournisseur/handlers/index").handleUpdateOne;
const handleReadOneCartByUserId = require("./../../cart/handlers/index").handleReadOneByUserId;
const handleDeleteOneCartById = require("./../../cart/handlers/index").handleDeleteOne;
const handleReadOneUser = require("./../../../authentication/handlers").handleReadOne;
const handleUpdateOneUser = require("./../../../authentication/handlers").handleUpdateOne;

//INIT
exports.handleInit = async (content) => {
  const allItems = await this.handleReadAll();
  if (allItems.message.length !== 0) return switchStatus({ status: 400, message: "Database already initialised" });
  if (content.role !== "MARKET") return switchStatus({ status: 403, message: "Not authorized" });
  const allItemsBase = await itemsBase.handleReadAll();
  for (let i = 0; i < allItemsBase.message.length; i++) {
    const element = allItemsBase.message[i];
    let newItem = {
      item: element,
      userId: content._id,
      price: element.coefPrice * 3,
    };
    await create(ItemSchema, newItem);
  }
  return switchStatus({ status: 200, message: "Database initialized" });
};

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  const user = (await handleReadOneUser(content.userId)).message;
  let listOfItems = [];
  //Get all Items of the Cart
  for (let i = 0; i < content.items.length; i++) {
    const element = content.items[i];
    listOfItems.push({
      item: element.item,
      quantity: element.quantity,
      userId: content.userId,
      price: 2 * element.item.coefPrice,
    });
  }
  //Verify if quantity of market is ok and if price is ok
  const resultAllItemFournisseur = (await handleReadAllItemFournisseur()).message;
  let approuvedQuantityItems = [];
  let notApprouvedQuantityItems = [];
  let errorsQuantity = {};
  let moneyNeeded = 0;
  for (let i = 0; i < listOfItems.length; i++) {
    const itemMarket = listOfItems[i];
    for (let j = 0; j < resultAllItemFournisseur.length; j++) {
      const itemFournisseur = resultAllItemFournisseur[j];
      if (itemMarket.item._id.toString() === itemFournisseur.item._id.toString()) {
        if (itemMarket.quantity <= itemFournisseur.quantity) {
          approuvedQuantityItems.push(itemMarket);
          moneyNeeded += parseFloat(itemMarket.quantity) * parseFloat(itemFournisseur.price);
        } else {
          notApprouvedQuantityItems.push(itemMarket);
          errorsQuantity[itemMarket.item.labels] = `Please verify quantity asked for product: ${itemMarket.item.labels.toUpperCase()}`;
        }
        j = resultAllItemFournisseur.length;
      }
    }
  }
  if (notApprouvedQuantityItems.length > 0) return switchStatus({ status: 400, message: errorsQuantity });
  if (moneyNeeded > user.money) return switchStatus({ status: 400, message: "Not enough money in account!" });
  //Create items with quantity in market database items
  const resutlAllItemsMarket = await this.handleReadAll();
  if (resutlAllItemsMarket.status === 200 && resutlAllItemsMarket.message.length > 0) {
    for (let i = 0; i < approuvedQuantityItems.length; i++) {
      const itemToCreate = approuvedQuantityItems[i];
      for (let j = 0; j < resutlAllItemsMarket.message.length; j++) {
        const itemMarketInDB = resutlAllItemsMarket.message[j];
        if (itemToCreate.item._id.toString() === itemMarketInDB.item._id.toString()) {
          if (itemToCreate.item.datePeremption === itemMarketInDB.item.datePeremption) {
            let newQuantity = parseFloat(itemToCreate.quantity) + parseFloat(itemMarketInDB.quantity);
            let newItemUpdated = {
              id: itemMarketInDB._id,
              item: itemMarketInDB.item,
              quantity: newQuantity,
              userId: itemMarketInDB.userId,
              price: itemMarketInDB.price,
            };
            await updateOne(ItemMarketSchema, newItemUpdated.id, newItemUpdated);
            j = resutlAllItemsMarket.message.length;
          }
        }
        if (j === resutlAllItemsMarket.message.length - 1) {
          await create(ItemMarketSchema, itemToCreate);
        }
      }
    }
  } else {
    for (let i = 0; i < approuvedQuantityItems.length; i++) {
      const element = approuvedQuantityItems[i];
      await create(ItemMarketSchema, element);
    }
  }

  //Reduce user Money
  let newMoney = parseFloat(user.money) - parseFloat(moneyNeeded);
  let updatedUser = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    password: user.password,
    role: user.role,
    money: newMoney,
  };
  await handleUpdateOneUser(updatedUser, updatedUser.id);

  // Add money to market user
  const fournisseurUser = (await handleReadOneUser(resultAllItemFournisseur[0].userId)).message;
  let newMoneyMarket = parseFloat(fournisseurUser.money) + parseFloat(moneyNeeded);
  let updatedUserMarket = {
    id: fournisseurUser._id,
    fullName: fournisseurUser.fullName,
    email: fournisseurUser.email,
    password: fournisseurUser.password,
    role: fournisseurUser.role,
    money: newMoneyMarket,
  };
  await handleUpdateOneUser(updatedUserMarket, updatedUserMarket.id);

  //Reduce quantity of FournisseurItems
  for (let i = 0; i < approuvedQuantityItems.length; i++) {
    const itemMarket = approuvedQuantityItems[i];
    for (let j = 0; j < resultAllItemFournisseur.length; j++) {
      const itemFournisseur = resultAllItemFournisseur[j];
      if (itemMarket.item._id.toString() === itemFournisseur.item._id.toString()) {
        let newItemMarket = {
          id: itemFournisseur._id,
          item: itemFournisseur.item,
          quantity: parseFloat(itemFournisseur.quantity) - itemMarket.quantity,
          userId: itemFournisseur.userId,
          price: itemFournisseur.price,
        };
        await handleUpdateOneItemFournisseur(newItemMarket, newItemMarket.id);
        j = resultAllItemFournisseur.length;
      }
    }
  }
  //Create Transaction
  let listOfItemsFormatedClient = [];
  let listOfItemsFormatedMarket = [];
  for (let i = 0; i < approuvedQuantityItems.length; i++) {
    const currentItem = approuvedQuantityItems[i];
    listOfItemsFormatedClient.push(
      new ItemMarketSchema({
        ...currentItem,
      })
    );
    listOfItemsFormatedMarket.push(
      new ItemFournisseurSchema({
        ...currentItem,
      })
    );
  }
  let marketTransaction = {
    userId: user._id,
    items: listOfItemsFormatedClient,
    price: parseFloat(moneyNeeded),
  };
  let fournisseurTransaction = {
    userId: fournisseurUser._id,
    items: listOfItemsFormatedClient,
    price: parseFloat(moneyNeeded),
  };
  await create(TransactionMarketSchema, marketTransaction);
  await create(TransactionFournisseurSchema, fournisseurTransaction);

  //Create Notification for MarketUser and FournisseurUser
  let marketNotification = {
    userId: user._id,
    msg: "Vous avez une nouvelle transaction d'achat de: €" + moneyNeeded,
    status: "ACTIVE",
  };
  let fournisseurNotification = {
    userId: fournisseurUser._id,
    msg: "Vous avez une nouvelle transaction de vente de: €" + moneyNeeded,
    status: "ACTIVE",
  };
  await create(NotificationSchema, marketNotification);
  await create(NotificationSchema, fournisseurNotification);

  //Delete cart of userId
  await handleDeleteOneCartById((await handleReadOneCartByUserId(content.userId)).message._id);
  return switchStatus({ status: 200, message: "Nice purchase!" });
};
//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(ItemSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(ItemSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await updateOne(ItemSchema, id, dataReduced));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  const myItem = await this.handleReadOne(id);
  if (myItem.status === 200) {
    //Create Notification
    let marketNotification = {
      userId: myItem.message.userId,
      msg: "Vous avez jeté " + myItem.message.quantity + " produit(s): " + myItem.message.item.labels,
      status: "ACTIVE",
    };
    await create(NotificationSchema, marketNotification);
    return switchStatus(await deleteOne(ItemMarketSchema, id));
  } else {
    return switchStatus({ ...myItem });
  }
};
