const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/auth/authControllers");
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(12).required(),
});

router.post(
    "/register",
    validator.body(registerSchema),
    authControllers.controllers.postRegister
);
router.post(
    "/login",
    validator.body(loginSchema),
    authControllers.controllers.postLogin
);

module.exports = router;
