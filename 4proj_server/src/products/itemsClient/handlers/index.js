const { create, updateOne, readAll, readOne, deleteOne } = require("../../../middleware/requests");
const { validateData, reduceData } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const ItemClientSchema = require("./../../../models/itemsClient");
const ItemMarketSchema = require("./../../../models/itemsMarket");
const NotificationSchema = require("./../../../models/notification");
const TransactionClientSchema = require("./../../../models/transactionsClient");
const TransactionMarketSchema = require("./../../../models/transactionsMarket");
const handleReadAllItemMarket = require("./../../itemsMarket/handlers/index").handleReadAll;
const handleUpdateOneItemMarket = require("./../../itemsMarket/handlers/index").handleUpdateOne;
const handleReadOneCartByUserId = require("./../../cart/handlers/index").handleReadOneByUserId;
const handleDeleteOneCartById = require("./../../cart/handlers/index").handleDeleteOne;
const handleReadOneUser = require("./../../../authentication/handlers").handleReadOne;
const handleUpdateOneUser = require("./../../../authentication/handlers").handleUpdateOne;

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
      price: 3 * element.item.coefPrice,
    });
  }
  //Verify if quantity of market is ok and if price is ok
  const resultAllItemMarket = (await handleReadAllItemMarket()).message;
  let approuvedQuantityItems = [];
  let notApprouvedQuantityItems = [];
  let errorsQuantity = {};
  let moneyNeeded = 0;
  for (let i = 0; i < listOfItems.length; i++) {
    const itemClient = listOfItems[i];
    for (let j = 0; j < resultAllItemMarket.length; j++) {
      const itemMarket = resultAllItemMarket[j];
      if (itemClient.item._id.toString() === itemMarket.item._id.toString()) {
        if (itemClient.quantity <= itemMarket.quantity) {
          approuvedQuantityItems.push(itemClient);
          moneyNeeded += parseFloat(itemClient.quantity) * parseFloat(itemMarket.price);
        } else {
          notApprouvedQuantityItems.push(itemClient);
          errorsQuantity[itemClient.item.labels] = `Please verify quantity asked for product: ${itemClient.item.labels.toUpperCase()}`;
        }
        j = resultAllItemMarket.length;
      }
    }
  }
  if (notApprouvedQuantityItems.length > 0) return switchStatus({ status: 400, message: errorsQuantity });
  if (moneyNeeded > user.money) return switchStatus({ status: 400, message: "Not enough money in account!" });
  //Create items with quantity in client database items
  const resutlAllItemsClient = await this.handleReadAll();
  let myListOfItems = [];
  for (let y = 0; y < resutlAllItemsClient.message.length; y++) {
    const oneItem = resutlAllItemsClient.message[y];
    if (oneItem.userId.toString() === user._id.toString()) {
      myListOfItems.push(oneItem);
    }
  }
  if (resutlAllItemsClient.status === 200 && myListOfItems.length > 0) {
    for (let i = 0; i < approuvedQuantityItems.length; i++) {
      const itemToCreate = approuvedQuantityItems[i];
      for (let j = 0; j < myListOfItems.length; j++) {
        const itemClientInDB = myListOfItems[j];
        if (itemToCreate.item._id.toString() === itemClientInDB.item._id.toString()) {
          if (itemToCreate.item.datePeremption === itemClientInDB.item.datePeremption) {
            let newQuantity = parseFloat(itemToCreate.quantity) + parseFloat(itemClientInDB.quantity);
            let newItemUpdated = {
              id: itemClientInDB._id,
              item: itemClientInDB.item,
              quantity: newQuantity,
              userId: itemClientInDB.userId,
              price: itemClientInDB.price,
            };
            await updateOne(ItemClientSchema, newItemUpdated.id, newItemUpdated);
            j = myListOfItems.length;
          }
        }
        if (j === myListOfItems.length - 1) {
          await create(ItemClientSchema, itemToCreate);
        }
      }
    }
  } else {
    for (let i = 0; i < approuvedQuantityItems.length; i++) {
      const element = approuvedQuantityItems[i];
      await create(ItemClientSchema, element);
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
  const marketUser = (await handleReadOneUser(resultAllItemMarket[0].userId)).message;
  let newMoneyMarket = parseFloat(marketUser.money) + parseFloat(moneyNeeded);
  let updatedUserMarket = {
    id: marketUser._id,
    fullName: marketUser.fullName,
    email: marketUser.email,
    password: marketUser.password,
    role: marketUser.role,
    money: newMoneyMarket,
  };
  await handleUpdateOneUser(updatedUserMarket, updatedUserMarket.id);

  //Reduce quantity of MarketItems
  for (let i = 0; i < approuvedQuantityItems.length; i++) {
    const itemClient = approuvedQuantityItems[i];
    for (let j = 0; j < resultAllItemMarket.length; j++) {
      const itemMarket = resultAllItemMarket[j];
      if (itemClient.item._id.toString() === itemMarket.item._id.toString()) {
        let newItemMarket = {
          id: itemMarket._id,
          item: itemMarket.item,
          quantity: parseFloat(itemMarket.quantity) - itemClient.quantity,
          userId: itemMarket.userId,
          price: itemMarket.price,
        };
        await handleUpdateOneItemMarket(newItemMarket, newItemMarket.id);
        j = resultAllItemMarket.length;
      }
    }
  }
  //Create Transaction
  let listOfItemsFormatedClient = [];
  let listOfItemsFormatedMarket = [];
  for (let i = 0; i < approuvedQuantityItems.length; i++) {
    const currentItem = approuvedQuantityItems[i];
    listOfItemsFormatedClient.push(
      new ItemClientSchema({
        ...currentItem,
      })
    );
    listOfItemsFormatedMarket.push(
      new ItemMarketSchema({
        ...currentItem,
      })
    );
  }
  let clientTransaction = {
    userId: user._id,
    items: listOfItemsFormatedClient,
    price: parseFloat(moneyNeeded),
  };
  let marketTransaction = {
    userId: marketUser._id,
    items: listOfItemsFormatedClient,
    price: parseFloat(moneyNeeded),
  };
  await create(TransactionClientSchema, clientTransaction);
  await create(TransactionMarketSchema, marketTransaction);

  //Create Notification for MarketUser and ClientUser
  let clientNotification = {
    userId: user._id,
    msg: "Vous avez une nouvelle transaction d'achat de: €" + moneyNeeded,
    status: "ACTIVE",
  };
  let marketNotification = {
    userId: marketUser._id,
    msg: "Vous avez une nouvelle transaction de vente de: €" + moneyNeeded,
    status: "ACTIVE",
  };
  await create(NotificationSchema, clientNotification);
  await create(NotificationSchema, marketNotification);

  //Delete cart of userId
  await handleDeleteOneCartById((await handleReadOneCartByUserId(content.userId)).message._id);
  return switchStatus({ status: 200, message: "Nice purchase!" });
};
//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(ItemClientSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(ItemClientSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  if (content.quantityUpdate > 0) {
    let itemToUpdate = {
      quantity: content.quantityUpdate,
    };
    await updateOne(ItemClientSchema, id, itemToUpdate);
  } else {
    await deleteOne(ItemClientSchema, id);
  }
  //Create Notification for MarketUser and ClientUser
  let clientNotification = {
    userId: content.userId,
    msg: "Vous avez consommé " + content.quantityAsked + " du produit : " + content.item.labels,
    status: "ACTIVE",
  };
  return switchStatus(await create(NotificationSchema, clientNotification));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  const myItem = await this.handleReadOne(id);
  if (myItem.status === 200) {
    //Create Notification
    let clientNotification = {
      userId: myItem.message.userId,
      msg: "Vous avez jeté " + myItem.message.quantity + " produit(s): " + myItem.message.item.labels,
      status: "ACTIVE",
    };
    await create(NotificationSchema, clientNotification);
    return switchStatus(await deleteOne(ItemClientSchema, id));
  } else {
    return switchStatus({ ...myItem });
  }
};

// return switchStatus({ status: 200, message: "test" });
