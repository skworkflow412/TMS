// src/server.js
const express = require("express");
const dotenv = require("dotenv");
const { startClient, sendMessage } = require("./telegram");

dotenv.config();
const app = express();
app.use(express.json());

app.post("/send-messages", async (req, res) => {
    const { recipients, message, delay } = req.body;
    if (!recipients || !message) return res.status(400).json({ error: "Missing fields" });

    try {
        for (const recipient of recipients) {
            await sendMessage(recipient, message);
            console.log(`Waiting ${delay} seconds before next message...`);
            await new Promise(resolve => setTimeout(resolve, delay * 1000));
        }
        res.json({ success: true, message: "Messages sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Message sending failed" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await startClient();
});
