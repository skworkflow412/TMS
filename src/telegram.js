const { StringSession } = require("telegram/sessions");
const { Api, TelegramClient } = require("telegram");
const fs = require("fs");
const path = require("path");
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE, TELEGRAM_SESSION } = require("./config");

const SESSION_FILE = path.join(__dirname, "session.txt");

// Load session from file or environment
let sessionString = TELEGRAM_SESSION;
if (fs.existsSync(SESSION_FILE)) {
    sessionString = fs.readFileSync(SESSION_FILE, "utf-8").trim();
}

const session = new StringSession(sessionString);
const client = new TelegramClient(session, TELEGRAM_API_ID, TELEGRAM_API_HASH, { connectionRetries: 5 });

async function startClient() {
    try {
        await client.start({
            phoneNumber: async () => TELEGRAM_PHONE,
            password: async () => "", // Only if 2FA is enabled
            phoneCode: async () => {
                console.log("Enter the code sent to your Telegram:");
                return new Promise(resolve => {
                    process.stdin.once("data", data => resolve(data.toString().trim()));
                });
            },
            onError: err => console.log("Error:", err),
        });

        console.log("Telegram client started!");

        // Save session after successful login
        const savedSession = client.session.save();
        fs.writeFileSync(SESSION_FILE, savedSession, "utf-8");
        console.log("Session saved successfully.");
    } catch (error) {
        console.error("Failed to start Telegram client:", error);
    }
}

async function sendMessage(recipient, message) {
    try {
        await client.sendMessage(recipient, { message });
        console.log(`Message sent to ${recipient}`);
    } catch (error) {
        console.error(`Failed to send message to ${recipient}:`, error);
    }
}

module.exports = { startClient, sendMessage };
