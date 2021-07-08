// const { create, updateOne, readAll, readOne, deleteOne, getUserNotif, readOneByUserId } = require("./../../../middleware/requests");
const { reduceData } = require("./../reducers");
const { switchStatus } = require("./../../../middleware/statusRes");
const getUserCart = require("./../../cart/handlers/index").handleGetUserCart;
const RecommendationSystem = require("./../../../middleware/reco_sys");

//READ ONE
exports.handleGetRecommendation = async (id) => {
  let data = {
    userId: id,
  };
  const userCart = await getUserCart(data);
  if (userCart.status === 200 && userCart.message.items.length > 0) {
    let dataReduced = reduceData(userCart.message);
    let recommendedProducts = await RecommendationSystem(dataReduced);
    return switchStatus({ status: 200, message: recommendedProducts });
  } else {
    return switchStatus({ status: 400, message: "No cart" });
  }
};
