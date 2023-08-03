const Chat = require("../../models/Chat");
// const config = require("config");
require("dotenv").config();
// const API_KEY = config.get("API_KEY");
const API_KEY = process.env.jwtSecret;

const postPrompt = async (req, res) => {
    try {
        console.log("inside post prompt");

        const promptValue = req.body.promptValue;
        const user = req.user.id;
        console.log("prompt os ", promptValue);
        console.log("user os ", user);
        console.log("token os ", req.headers["x-auth-token"]);

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

        const openAiSaid = await fetch(
            "https://api.openai.com/v1/chat/completions",
            options
        );
        // const data = await response.json();
        const data = typeof JSON.stringify(openAiSaid);
        console.log("data : ", data);
        console.log("hello");
        // const aiResponse = data.choices[0].message.content;
        console.log("hello");
        // return res.json({ aiResponse });
        return res.json({ aiResponse: "hello" });
    } catch (error) {
        return res.status(400).json({ msg: `error : ${error} ` });
    }

    // // return res.json({ aiResponse: user });
    // // let token = req.headers["x-auth-token"];
    // // console.log("token is", req.headers["x-auth-token"]);
    // // const promptValue = req.body.promptValue;
    // // console.log("|||||||||||||||||||||||||||||||||||||||||||");
    // // console.log("headers r ==========", req.headers);

    // // console.log("|||||||||||||||||||||||||||||||||||||||||||");

    // if (!token) {
    //     console.log("gimme a token");
    //     return res.status(401).json({ msg: "No Token. Authorization Denied." });
    // }
    // try {
    //     const decoded = jwt.verify(token, config.get("jwtSecret"));
    //     // req.user = decoded.user;
    //     const user = decoded.user;

    //     // req.body.user = decoded.user;

    //     // console.log(
    //     //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    //     // );
    //     console.log("req user is", user.id);
    //     // console.log(
    //     //     "\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\"
    //     // );

    //     // const options = {
    //     //     method: "POST",
    //     //     headers: {
    //     //         Authorization: `Bearer ${API_KEY}`,
    //     //         "Content-Type": "application/json",
    //     //     },
    //     //     body: JSON.stringify({
    //     //         model: "gpt-3.5-turbo",
    //     //         messages: [{ role: "user", content: promptValue }],
    //     //         max_tokens: 100,
    //     //     }),
    //     // };

    //     try {
    //         const response = await fetch(
    //             "https://api.openai.com/v1/chat/completions",
    //             options
    //         );
    //         const data = await response.json();
    //         return res.send(data.choices[0].message.content);
    //     } catch (error) {
    //         return res.status(400).send("error");
    //     }
    // } catch (error) {
    //     return res.status(401).json({ msg: "Token is not valid" });
    // }

    // // try {
    // //     console.log("inside post");

    // //     const promptValue = req.body.promptValue;
    // //     const user = req.user.id;
    // //     const API_KEY = config.get("API_KEY");

    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");
    // //     console.log("inside prompt routes with prompt :", promptValue);
    // //     console.log("id being seacrhed for in chats is :", user);
    // //     console.log("API KEY :", API_KEY);
    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");

    // //     const openAiEndpoint = "https://api.openai.com/v1/completions";

    // //     // const response = await axios.post(
    // //     //     openAiEndpoint,
    // //     //     {
    // //     //         prompt: promptValue,
    // //     //         max_tokens: 150, // You can adjust this parameter to control the response length
    // //     //     },
    // //     //     {
    // //     //         headers: {
    // //     //             "Content-Type": "application/json",
    // //     //             Authorization: `Bearer ${API_KEY}`,
    // //     //         },
    // //     //     }
    // //     // );

    // //     // const options = {
    // //     //     method: "POST",
    // //     //     headers: {
    // //     //         "Content-Type": "application/json",
    // //     //         Authorization: `Bearer ${API_KEY}`,
    // //     //     },
    // //     //     body: JSON.stringify({
    // //     //         model: "gpt-3.5-turbo",
    // //     //         messages: [{ role: "user", content: promptValue }],
    // //     //         max_tokens: 100,
    // //     //     }),
    // //     // };
    // //     // const response = await fetch(openAiEndpoint, options);

    // //     const response = await fetch(openAiEndpoint, {
    // //         method: "POST",
    // //         headers: {
    // //             "Content-Type": "application/json",
    // //             Authorization: `Bearer ${API_KEY}`,
    // //         },
    // //         body: JSON.stringify({
    // //             promptValue,
    // //             max_tokens: 150, // You can adjust this parameter to control the response length
    // //         }),
    // //     });

    // //     const data = await response.json();
    // //     // const aiResponse = data.choices[0].text.trim();
    // //     const aiResponse = data;

    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");
    // //     // const aiResponse = response.data.choices[0];
    // //     // const aiResponse = response.data;
    // //     // const aiResponse = response.data;
    // //     // const aiResponse = response;
    // //     // const aiResponse = response.data.choices[0].text.trim();
    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");
    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");
    // //     console.log("ai said :", aiResponse);
    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");
    // //     console.log("||||||||||||||||||||||||||||||||||||||||||||||||||||");

    // //     // res.json({ aiResponse: aiResponse });
    // //     // res.send({ aiResponse });

    // //     // const options = {
    // //     //     method: "POST",
    // //     //     headers: {
    // //     //         Authorization: `Bearer ${API_KEY}`,
    // //     //         "Content-Type": "application/json",
    // //     //     },
    // //     //     body: JSON.stringify({
    // //     //         model: "gpt-3.5-turbo",
    // //     //         messages: [{ role: "user", content: promptValue }],
    // //     //         max_tokens: 100,
    // //     //     }),
    // //     // };
    // //     // const response = await fetch(
    // //     //     "https://api.openai.com/v1/chat/completions",
    // //     //     options
    // //     // );
    // //     // const data = await response.json();
    // //     // const aiResponse = data.choices[0].message.content;
    // //     // const message = {
    // //     //     user: promptValue,
    // //     //     ai: aiResponse,
    // //     // };
    // //     // var chats;
    // //     // chats = await Chat.findOne({
    // //     //     user,
    // //     // });
    // //     // if (chats) {
    // //     //     console.log("___________________________________");
    // //     //     console.log("chats already exist");
    // //     //     console.log("pushing new message");
    // //     //     console.log("___________________________________");
    // //     //     chats.messages.push(message);
    // //     //     await chats.save();
    // //     //     console.log("___________________________________");
    // //     //     console.log("new chats are", chats);
    // //     //     console.log("___________________________________");
    // //     // } else {
    // //     //     console.log("___________________________________");
    // //     //     console.log("creating new chat");
    // //     //     console.log("message :", message);
    // //     //     console.log("___________________________________");
    // //     //     const newChat = new Chat({
    // //     //         user,
    // //     //         messages: [message],
    // //     //     });
    // //     //     await newChat.save();
    // //     //     console.log("___________________________________");
    // //     //     console.log("saved new chat and msg");
    // //     //     console.log("___________________________________");
    // //     // }
    // //     // console.log("___________________________________");
    // //     // console.log("about to exit");
    // //     // console.log("___________________________________");
    // //     // return res.json({ aiResponse });
    // //     // return res.json({ message: "hello" });
    // // } catch (error) {
    // //     console.log("|||||||||||||||||||||||||||||||||||||");
    // //     console.log("F A I L U R E");
    // //     console.error(error);
    // //     console.log("|||||||||||||||||||||||||||||||||||||");

    // //     // Send an error response to the client in case of an error
    // //     return res.status(500).json({ error: "Something went wrong" });
    // // }
};

module.exports = postPrompt;
