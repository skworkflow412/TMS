const { StringSession } = require("telegram"); // Correct import
const { Api, TelegramClient } = require("telegram");
const { TELEGRAM_API_ID, TELEGRAM_API_HASH, TELEGRAM_PHONE, TELEGRAM_SESSION } = require("./config");

const session = new StringSession(TELEGRAM_SESSION || ""); // Ensure session is not undefined
const client = new TelegramClient(session, TELEGRAM_API_ID, TELEGRAM_API_HASH, { connectionRetries: 5 });

async function startClient() {
    await client.start({
        phoneNumber: async () => TELEGRAM_PHONE,
        password: async () => "", // Only if 2FA is enabled
        phoneCode: async () => {
            console.log("Enter the code sent to your Telegram:");
            return new Promise(resolve => {
                process.stdin.once("data", data => resolve(data.toString().trim()));
            });
        },
        onError: err => console.error("Error:", err),
    });

    console.log("Telegram client started!");
}

async function sendMessage(recipient, message) {
    await client.sendMessage(recipient, { message });
    console.log(`Message sent to ${recipient}`);
}

module.exports = { startClient, sendMessage };
