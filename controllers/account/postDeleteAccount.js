const User = require("../../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const postDeleteAccount = async (req, res) => {
    console.log("delete event came");
    console.log("Req headres inside post delete", req.headers);
    const token = req.headers["x-auth-token"];
    const decoded = jwt.verify(token, process.env.jwtSecret);
    const userId = decoded.user.id;
    console.log("user is ", userId);

    try {
        await Chat.findOneAndDelete({ user: userId });

        // get user
        await User.findByIdAndDelete(userId);

        console.log("Account Has Been Deleted");
        return res.status(200).json({ msg: "Account Has Been Deleted" });
    } catch (error) {
        console.log("ERRRRRORRRRRRRR");
        console.error(error);
        return res.status(400).json({ msg: "Error" }); // Return here to prevent multiple responses
    }
};

module.exports = postDeleteAccount;
