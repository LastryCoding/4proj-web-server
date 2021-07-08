const router = require("express").Router();
const { getRecommendation } = require("./../controllers");

// GET ONE
router.route("/:id").get(getRecommendation);

module.exports = router;
