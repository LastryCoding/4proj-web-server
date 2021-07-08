const router = require("express").Router();
const { register, login, prvRoute, update, readOne, test } = require("../controllers");

// // TEST
// router.route("/test").get(test);

// REGISTER
router.route("/").post(register);
// LOGIN
router.route("/login").post(login);
// PRIVATEROUTE
router.route("/prv").get(prvRoute);
// GET ONE
router.route("/:id").get(readOne);
// UPDATE ONE
router.route("/:id").put(update);

module.exports = router;
