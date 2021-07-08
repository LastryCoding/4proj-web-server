const { create, updateOne, readAll, readOne, deleteOne } = require("../../../middleware/requests");
const { validateData, reduceData, uniqueCategories } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const shelveSchema = require("./../../../models/shelveMarket");
const handleUpdateOneItemMarket = require("./../../itemsMarket/handlers/index").handleUpdateOne;
const handleReadOneItemMarket = require("./../../itemsMarket/handlers/index").handleReadOne;
const handleReadAllItemMarket = require("./../../itemsMarket/handlers/index").handleReadAll;

//CREATE
exports.handleInit = async (content) => {
  const readAllItemMarket = (await handleReadAllItemMarket()).message;
  if ((await this.handleReadAll()).message.length > 0) return switchStatus({ status: 400, message: "Already initiated!" });
  let uniqueCategoriesList = uniqueCategories(readAllItemMarket);
  // Create shelves
  for (let i = 0; i < uniqueCategoriesList.length; i++) {
    const categorie = uniqueCategoriesList[i];
    await this.handleCreateOne({
      name: categorie,
      userId: content._id,
      sensor: false,
      alertDate: false,
      alertQuantity: false,
    });
  }
  // Affect product to shelves
  const readAllShelves = (await this.handleReadAll()).message;
  await affectItemToShelve(readAllShelves, readAllItemMarket, 100, content._id);
  return switchStatus({ status: 200, message: "Initialisation done!" });
};

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await create(shelveSchema, dataReduced));
};
//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(shelveSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(shelveSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  if (dataReduced.item) {
    // Edit the items of the shelves
    let myNewReducedData = (await this.handleReadOne(id)).message;
    if (myNewReducedData.items.length > 0) {
      // If shelves have already items
      for (let i = 0; i < myNewReducedData.items.length; i++) {
        const itemInShelveDB = myNewReducedData.items[i];
        if (dataReduced.item._id.toString() === itemInShelveDB._id.toString() && dataReduced.item.datePeremption === itemInShelveDB.datePeremption) {
          myNewReducedData.items[i].quantity += dataReduced.item.quantity;
          i = myNewReducedData.items.length;
        }
        if (i === myNewReducedData.items.length - 1) {
          myNewReducedData.items.push(dataReduced.item);
          i = myNewReducedData.items.length;
        }
      }
      // Update itemsMarket quantity
      const itemMarket = (await handleReadOneItemMarket(content.itemMarketId)).message;
      let newItemMarket = {
        id: itemMarket._id,
        item: itemMarket.item,
        quantity: itemMarket.quantity - parseFloat(dataReduced.item.quantity),
        userId: itemMarket.userId,
        price: itemMarket.price,
      };
      await handleUpdateOneItemMarket(newItemMarket, newItemMarket.id);

      let quantityBool = false;
      let verifiedReducedData = [];
      for (let i = 0; i < myNewReducedData.items.length; i++) {
        const item = myNewReducedData.items[i];
        if (item.quantity > 0) {
          verifiedReducedData.push(item);
        }
        if (item.quantity < 20 && item.quantity > 0) {
          quantityBool = true;
        }
      }
      myNewReducedData.items = verifiedReducedData;
      myNewReducedData.alertQuantity = quantityBool;
      return switchStatus(await updateOne(shelveSchema, id, myNewReducedData));
    } else {
      // If shelves doesnt have any items
      let myNewReducedData = {
        ...dataReduced,
        items: [dataReduced.item],
      };
      return switchStatus(await updateOne(shelveSchema, id, myNewReducedData));
    }
  } else {
    // Edit the name of the shelves
    return switchStatus(await updateOne(shelveSchema, id, dataReduced));
  }
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  const getOneShelve = (await this.handleReadOne(id)).message;
  await affectItemToShelve([getOneShelve], getOneShelve.items, -1, getOneShelve.userId);
  return switchStatus(await deleteOne(shelveSchema, id));
};

const affectItemToShelve = async (AllShelves, AllItemMarket, quantity, userID) => {
  for (let i = 0; i < AllShelves.length; i++) {
    const oneShelve = AllShelves[i];
    for (let j = 0; j < AllItemMarket.length; j++) {
      const oneItem = AllItemMarket[j];
      if (oneItem.item.level1 === oneShelve.name) {
        let newShelve = {
          userId: userID,
          name: oneShelve.name,
          item: oneItem,
          itemMarketId: oneItem._id,
        };
        if (quantity === -1) {
          newShelve.item.quantity = -oneItem.quantity;
        } else {
          newShelve.item.quantity = quantity;
        }
        await this.handleUpdateOne(newShelve, oneShelve._id);
      }
    }
  }
};
