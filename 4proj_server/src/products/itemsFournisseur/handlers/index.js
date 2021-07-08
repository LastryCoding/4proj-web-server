const { create, updateOne, readAll, readOne, deleteOne } = require("../../../middleware/requests");
const { validateData, reduceData } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const ItemSchema = require("./../../../models/itemsFournisseur");
const itemsBase = require("./../../items/handlers");

//INIT
exports.handleInit = async (content) => {
  const allItems = await this.handleReadAll();
  if (allItems.message.length !== 0) return switchStatus({ status: 400, message: "Database already initialised" });
  if (content.role !== "FOURNISSEUR") return switchStatus({ status: 403, message: "Not authorized" });
  const allItemsBase = await itemsBase.handleReadAll();
  for (let i = 0; i < allItemsBase.message.length; i++) {
    const element = allItemsBase.message[i];
    let newItem = {
      item: element,
      userId: content._id,
      price: element.coefPrice * 2,
    };
    await create(ItemSchema, newItem);
  }
  return switchStatus({ status: 200, message: "Database initialized" });
};

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await create(ItemSchema, dataReduced));
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
  return switchStatus(await deleteOne(ItemSchema, id));
};
