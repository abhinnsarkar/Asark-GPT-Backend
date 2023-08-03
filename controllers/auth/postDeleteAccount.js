const User = require("../../models/User");
const Chat = require("../../models/Chat");

const postDeleteAccount = async (req, res) => {
    try {
        if (req.user.id) {
            console.log("delete event came");
            console.log(`user is ${req.user.id}`);

            // get chats
            // const chats = await Chat.find({ user: req.user.id });
            // console.log("chats = ", chats);
            await Chat.findOneAndDelete({ user: req.user.id });

            // get user
            // const user = await User.findById(req.user.id);
            // console.log("user = ", user);
            await User.findByIdAndDelete(req.user.id);

            console.log("Account Has Been Deleted");
            return res.status(200).json({ msg: "Account Has Been Deleted" });
        } else {
            console.log("no user in headers");
            return res
                .status(500)
                .json({ msg: "Something went wrong please try again" });
        }
    } catch (err) {
        console.log("Err");
        return res
            .status(500)
            .json({ msg: "Something went wrong please try again" });
    }
};

module.exports = postDeleteAccount;
