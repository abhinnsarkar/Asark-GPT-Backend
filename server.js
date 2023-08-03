require("dotenv").config();
// import fetch from "node-fetch";
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
// const fetch = require("node-fetch");

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const config = require("config");

// const auth = require("./middleware/auth");

// const authRoutes = require("./routes/api/authRoutes");
// const promptRoutes = require("./routes/api/promptRoutes");

// const PORT = 1234;

// const app = express();

// app.use(express.json());
// app.use(cors());

// app.use("/api/auth", authRoutes);
// // app.use("/api/prompts", promptRoutes);

// mongoose
//     .connect(process.env.mongoURI)
//     .then(() => {
//         app.listen(PORT, () => {
//             console.log(`Server is listening on ${PORT}`);
//             console.log("Connected to DB");
//         });
//     })
//     .catch((err) => {
//         console.log("database connection failed. Server not started");
//         console.error(err);
//     });

// app.get("/api", (req, res) => {
//     res.send("getting the api");
// });

// // app.listen(PORT, () => console.log("Server running on Port " + PORT));

// app.post("/api/prompts", auth, async (req, res) => {
//     const promptValue = req.body.promptValue;
//     const user = req.user.id;
//     const API_KEY = process.env.API_KEY;

//     const options = {
//         method: "POST",
//         headers: {
//             Authorization: `Bearer ${API_KEY}`,
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             model: "gpt-3.5-turbo",
//             messages: [{ role: "user", content: promptValue }],
//             max_tokens: 100,
//         }),
//     };
//     try {
//         const response = await fetch(
//             "https://api.openai.com/v1/chat/completions",
//             options
//         );

//         const data = await response.json();
//         console.log("ai said :", data.choices[0].message.content); // Log the message content
//         res.send(data.choices[0].message.content);
//     } catch (error) {
//         console.error(error);
//     }
//     // try {
//     //     const response = await fetch(
//     //         "https://api.openai.com/v1/chat/completions",
//     //         options
//     //     );

//     //     const data = await response.json();
//     //     console.log("ai said :", data.choices[0].message.content);
//     //     res.send("hello");
//     // } catch (error) {
//     //     console.error(error);
//     // }
// });

const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
// const config = require("config");
const API_KEY = process.env.API_KEY;
const jwt = require("jsonwebtoken");

const auth = require("./middleware/auth");
const Chat = require("./models/Chat");
const User = require("./models/User");

const authRoutes = require("./routes/api/authRoutes");
// const promptRoutes = require("./routes/api/promptRoutes");

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
// app.use("/api/prompts", promptRoutes);
// console.log(process.env);
// console.log(process.env.mongoURI);
// console.log(process.env.API_KEY);
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
    res.send("getting the api");
});
app.get("/", (req, res) => {
    res.send("getting the root");
});

app.post("/api/account/delete", async (req, res) => {
    console.log("delete event came");
    let token = req.headers["x-auth-token"];
    console.log("token in delete account is", req.headers["x-auth-token"]);

    if (!token) {
        return res.status(401).json({ msg: "No Token. Authorization Denied." });
    } else {
        const decoded = jwt.verify(token, process.env.jwtSecret);
        const userId = decoded.user.id;
        console.log("user is ", userId);

        try {
            // const chats = await Chat.find({ userId });
            // console.log("chats = ", chats);
            await Chat.findOneAndDelete({ user: userId });

            // get user
            // const user = await User.findById(userId);
            // console.log("user = ", userId);
            await User.findByIdAndDelete(userId);

            console.log("Account Has Been Deleted");
            return res.status(200).json({ msg: "Account Has Been Deleted" });
        } catch (error) {
            console.error(error);
            res.status(400).json({ msg: "error" });
        }
    }
});

app.post("/api/prompts", async (req, res) => {
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
                console.log("___________________________________");
                console.log("chats already exist");
                console.log("pushing new message");
                console.log("___________________________________");
                chats.messages.push(message);
                await chats.save();
                console.log("___________________________________");
                console.log("new chats are", chats);
                console.log("___________________________________");
            } else {
                console.log("___________________________________");
                console.log("creating new chat");
                console.log("message :", message);
                console.log("___________________________________");
                const newChat = new Chat({
                    user,
                    messages: [message],
                });
                await newChat.save();
                console.log("___________________________________");
                console.log("saved new chat and msg");
                console.log("___________________________________");
            }

            console.log("aiResponse is ===", aiResponse);

            res.send({ aiResponse });
        } catch (error) {
            console.error(error);
            res.status(400).send(error);
        }
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
});

app.get("/api/prompts", async (req, res) => {
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
            console.log("chats are ", chats);
            const msgs = chats[0].messages;
            console.log(msgs);

            res.json({ msgs });
        } catch (error) {
            console.error(error);
            res.status(400).send("error");
        }
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" });
    }
});
