const { handleGetRecommendation } = require("./../handlers");
const { switchStatusResponse } = require("./../../../middleware/statusRes");

// GET One
exports.getRecommendation = async (req, res) => {
  switchStatusResponse(await handleGetRecommendation(req.params.id), res);
};
