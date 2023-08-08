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
        return res.json({ aiResponse: "hello" });
    } catch (error) {
        return res.status(400).json({ msg: `error : ${error} ` });
    }
};

module.exports = postPrompt;
