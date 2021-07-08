const { create, updateOne, checkEmailPassword, readOne, checkSession } = require("../../middleware/requests");
const { validateData, reduceData } = require("../reducers");
const { switchStatus } = require("../../middleware/statusRes");
const UserSchema = require("./../../models/users");

//REGISTER
exports.handleRegister = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await create(UserSchema, dataReduced));
};
//READ ONE
exports.handleReadOne = async (id) => {
  return switchStatus(await readOne(UserSchema, id));
};
//UPDATE ONE
exports.handleUpdateOne = async (content, id) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  let dataReduced = reduceData(content);
  return switchStatus(await updateOne(UserSchema, id, dataReduced));
};
//LOGIN
exports.handleLogin = async (content) => {
  const { valid, errors } = validateData(content);
  if (!valid) return switchStatus({ status: 400, message: errors });
  return switchStatus(await checkEmailPassword(UserSchema, content));
};
//PRIVATE ROUTE
exports.handlePrvRoute = async (sessionUserId) => {
  return switchStatus(await checkSession(UserSchema, sessionUserId));
};
