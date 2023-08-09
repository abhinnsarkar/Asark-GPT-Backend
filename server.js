const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const API_KEY = process.env.API_KEY;
const jwt = require("jsonwebtoken");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const auth = require("./middleware/auth");
const Chat = require("./models/Chat");
const User = require("./models/User");

const authRoutes = require("./routes/api/authRoutes");
// const accountRoutes = require("./routes/api/accountRoutes");
// const promptRoutes = require("./routes/api/promptRoutes");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
// app.use("/api/account", accountRoutes);
// app.use("/api/prompts", promptRoutes);

mongoose
    .connect(process.env.mongoURI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is listening on ${PORT}`);
            console.log("Connected to DB");
        });
    })
    .catch((err) => {
        console.log("database connection failed. Server not started");
        console.error(err);
    });

app.get("/api", (req, res) => {
    res.json({ msg: "getting the api" });
});
app.get("/", (req, res) => {
    res.json({ msg: "getting the root" });
});

app.post("/api/prompts", async (req, res) => {
    console.log("___________________________________");
    let token = req.headers["x-auth-token"];
    console.log("token is", req.headers["x-auth-token"]);
    const promptValue = req.body.promptValue;
    // console.log("|||||||||||||||||||||||||||||||||||||||||||");
    // console.log("headers r ==========", req.headers);

    // console.log("|||||||||||||||||||||||||||||||||||||||||||");

    if (!token) {
        return res.status(401).json({ msg: "No Token. Authorization Denied." });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        // req.user = decoded.user;
        const user = decoded.user.id;

        // req.body.user = decoded.user;

        console.log(
            "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
        );
        console.log("prompt os", promptValue);
        console.log("user os", user);
        console.log(
            "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
        );

        const options = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: promptValue }],
                max_tokens: 100,
            }),
        };

        try {
            const response = await fetch(
                "https://api.openai.com/v1/chat/completions",
                options
            );
            const data = await response.json();
            console.log(data);
            const aiResponse = data.choices[0].message.content;

            const message = {
                user: promptValue,
                ai: aiResponse,
            };
            var chats;
            chats = await Chat.findOne({
                user,
            });
            if (chats) {
                console.log("chats already exist");
                console.log("pushing new message");
                chats.messages.push(message);
                await chats.save();
                // console.log("new chats are", chats);
            } else {
                console.log("creating new chat");
                console.log("message :", message);
                const newChat = new Chat({
                    user,
                    messages: [message],
                });
                await newChat.save();
                console.log("saved new chat and msg");
            }

            console.log("aiResponse from post in server is ===", aiResponse);
            console.log("___________________________________");
            res.json({ aiResponse });
        } catch (error) {
            console.error(error);
            res.status(400).json({ msg: error });
        }
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
});

app.get("/api/prompts", async (req, res) => {
    console.log("___________________________________");
    console.log("at the server level getting messages");
    let token = req.headers["x-auth-token"];
    console.log("token is", req.headers["x-auth-token"]);

    if (!token) {
        return res.status(401).json({ msg: "No Token. Authorization Denied." });
    }
    try {
        const decoded = jwt.verify(token, process.env.jwtSecret); // req.user = decoded.user;
        const user = decoded.user.id;

        try {
            const chats = await Chat.find({ user });
            console.log("chats retrieved are ", chats);
            if (chats.length === 0) {
                const msgs = chats[0];
                // console.log(msgs);
                console.log("___________________________________");
                res.json({ msgs });
            } else {
                const msgs = chats[0].messages;
                // console.log(msgs);
                console.log("___________________________________");
                res.json({ msgs });
            }
        } catch (error) {
            console.error(error);
            console.log("___________________________________");
            res.status(400).json({ msg: "error" });
        }
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
});

app.post("/api/account/delete", async (req, res) => {
    console.log(req.headers);
    let token = req.headers["x-auth-token"];
    console.log("token is", req.headers["x-auth-token"]);

    if (!token) {
        return res.status(401).json({ msg: "No Token. Authorization Denied." });
    }
    try {
        console.log("token in try is ", token);
        const decoded = jwt.verify(token, process.env.jwtSecret); // req.user = decoded.user;

        console.log("delete event came");
        console.log("Req headers inside delete:", req.headers);
        // const token = req.headers["x-auth-token"];
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
    } catch (error) {
        console.log("errreroeoreoroeor", error);
        res.status(401).json({ msg: "Token is not valid" });
    }
});
