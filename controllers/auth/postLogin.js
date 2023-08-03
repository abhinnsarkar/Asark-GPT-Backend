const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const config = require("config");
require("dotenv").config();

const postLogin = async (req, res) => {
    try {
        console.log("login event came");
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            console.log("proper credentials");

            // send new token
            const payload = {
                user: {
                    id: user.id,
                    email: user.email,
                },
            };
            // const secretKey = config.get("jwtSecret");
            const secretKey = process.env.jwtSecret;
            const expires = { expiresIn: "7d" };

            const token = jwt.sign(payload, secretKey, expires);
            console.log("Created token  = ", token);

            return res.status(200).json({ token, user });
        }

        return res.status(400).send("Invalid credentials. Please try again");
    } catch (err) {
        return res.status(500).send("Something went wrong. Please try again");
    }
};

module.exports = postLogin;
