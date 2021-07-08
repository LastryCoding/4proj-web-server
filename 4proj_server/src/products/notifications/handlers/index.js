const { create, updateOne, readAll, readOne, deleteOne, getUserNotif, readOneByUserId } = require("../../../middleware/requests");
const { validateData } = require("../reducers");
const { switchStatus } = require("../../../middleware/statusRes");
const NotifSchema = require("./../../../models/notification");

// HANDLE GET Notif OF USER
exports.handleGetUserNotif = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  return switchStatus(await getUserNotif(NotifSchema, content.userId));
};

//CREATE
exports.handleCreateOne = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  return switchStatus(await create(NotifSchema, content));
};

//READ ALL
exports.handleReadAll = async () => {
  return switchStatus(await readAll(NotifSchema));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(NotifSchema, id));
};
//READ ONE
exports.handleReadOneByUserId = async (id) => {
  return switchStatus(await readOneByUserId(NotifSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  return switchStatus(await updateOne(NotifSchema, id, content));
};
// DELETE ONE
exports.handleDeleteOne = async (id) => {
  return switchStatus(await deleteOne(NotifSchema, id));
};
