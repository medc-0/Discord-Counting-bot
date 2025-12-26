// Main bot entry point
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Load commands from commands/ folder
const commands = new Map();
const commandsPath = path.resolve(__dirname, "commands");
try {
  const files = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));
  for (const f of files) {
    try {
      const cmd = require(path.join(commandsPath, f));
      if (cmd && cmd.name && typeof cmd.execute === "function") {
        commands.set(cmd.name, cmd);
      }
    } catch (e) {
      console.error("Failed loading command", f, e);
    }
  }
} catch (e) {
  // ignore if commands folder missing
}

// Load event handlers
require("./events/ready")(client, commands);
require("./events/messageCreate")(client, commands);

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error("DISCORD_TOKEN not set in environment");
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error("Failed to login:", err);
});
