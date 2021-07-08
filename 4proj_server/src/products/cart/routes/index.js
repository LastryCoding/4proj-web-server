const router = require("express").Router();
const { create, update, readAll, readOne, remove, readUserCart, createUserCart } = require("../controllers");

// ADD TO USER CART
router.route("/userId/:id").post(createUserCart);
// GET USER CART
router.route("/userId/:id").get(readUserCart);
// GET ALL
router.route("/").get(readAll);
// CREATE NEW
router.route("/").post(create);
// GET ONE
router.route("/:id").get(readOne);
// UPDATE ONE
router.route("/:id").put(update);
// DELETE ONE
router.route("/:id").delete(remove);

module.exports = router;