const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("config");
require("dotenv").config();

const postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        console.log("register event came");

        // check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("user exists");
            return res.status(409).send("E-mail already in use");
        }

        // encrypt password
        const encryptedPassword = await bcrypt.hash(password, 10);

        // create user document and save in database
        const user = await User.create({
            name,
            email,
            password: encryptedPassword,
        });

        console.log("created user");

        const payload = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };

        // const secretKey = config.get("jwtSecret");
        const secretKey = process.env.jwtSecret;

        const expires = { expiresIn: "7d" };

        // create JWT token
        const token = jwt.sign(payload, secretKey, expires);
        console.log("Created token  = ", token);

        res.status(201).json({ token, user });
        // res.json({ token });
    } catch (err) {
        return res.status(500).send("Error occured. Please try again");
    }
};

module.exports = postRegister;
