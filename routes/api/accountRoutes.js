const express = require("express");
const router = express.Router();
const accountControllers = require("../../controllers/account/accountControllers");
const auth = require("../../middleware/auth");

router.post("/delete", auth, accountControllers.controllers.postDeleteAccount);

module.exports = router;
