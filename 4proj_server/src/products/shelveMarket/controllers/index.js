const { handleCreateOne, handleUpdateOne, handleReadAll, handleReadOne, handleDeleteOne, handleInit } = require("./../handlers");

const { switchStatusResponse } = require("./../../../middleware/statusRes");

// INIT SHELVES
exports.init = async (req, res) => {
  switchStatusResponse(await handleInit(req.body), res);
};

// CREATE NEW
exports.create = async (req, res) => {
  switchStatusResponse(await handleCreateOne(req.body), res);
};

// GET ALL
exports.readAll = async (req, res) => {
  switchStatusResponse(await handleReadAll(), res);
};

// UPDATE ONE
exports.update = async (req, res) => {
  switchStatusResponse(await handleUpdateOne(req.body, req.params.id), res);
};

// GET One
exports.readOne = async (req, res) => {
  switchStatusResponse(await handleReadOne(req.params.id), res);
};

// DELETE ONE
exports.remove = async (req, res) => {
  switchStatusResponse(await handleDeleteOne(req.params.id), res);
};
