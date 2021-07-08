const { handleRegister, handleUpdateOne, handleReadOne, handleLogin, handlePrvRoute } = require("../handlers");
const { switchStatusResponse } = require("../../middleware/statusRes");

// Register NEW
exports.register = async (req, res) => {
  const result = await handleRegister(req.body);
  if (result.status === 201) {
    req.session.userId = result.id;
  }
  switchStatusResponse(result, res);
};

// UPDATE ONE
exports.update = async (req, res) => {
  switchStatusResponse(await handleUpdateOne(req.body, req.params.id), res);
};

// GET One
exports.readOne = async (req, res) => {
  switchStatusResponse(await handleReadOne(req.params.id), res);
};

// LOG One
exports.login = async (req, res) => {
  const result = await handleLogin(req.body);
  if (result.status === 200) {
    req.session.userId = result.message._id;
  }
  switchStatusResponse(result, res);
};

// Check Cookie
exports.prvRoute = async (req, res) => {
  if (req.session?.userId) {
    const result = await handlePrvRoute(req.session.userId);
    switchStatusResponse(result, res);
  } else {
    switchStatusResponse({ status: 403, message: "Not authenticated" }, res);
  }
};

// // TEST
// exports.test = async (req, res) => {
//   // req.session.test = "test";
//   console.log(req.session,"ll");

//   switchStatusResponse({ status: 200, message: "test" }, res);
// };
