const express = require("express");
const router = express.Router();
const promptControllers = require("../../controllers/prompt/promptControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../../middleware/auth");

const promptSchema = Joi.object({
    promptValue: Joi.string().required(),
});

router.post(
    "/",
    auth,
    validator.body(promptSchema),
    promptControllers.controllers.postPrompt
);

module.exports = router;
