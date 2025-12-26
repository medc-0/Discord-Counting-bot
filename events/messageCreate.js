const counting = require("../utils/countingManager");
const mathEval = require("../utils/mathEvaluator");

module.exports = (client, commands = new Map()) => {
  client.on("messageCreate", async (message) => {
    try {
      if (message.author?.bot) return;
      if (!message.channel) return;

      const raw = String(message.content || "").trim();
      const PREFIX = "/";
      if (raw.startsWith(PREFIX)) {
        const parts = raw.slice(PREFIX.length).trim().split(/\s+/);
        const name = parts.shift().toLowerCase();
        const cmd = commands.get(name);
        if (cmd) {
          try {
            await cmd.execute(message, parts, { client, counting, mathEval });
          } catch (e) {
            console.error("Command execution error:", e);
            message.reply("Command failed to execute.").catch(() => {});
          }
        }
        return;
      }

      if (!raw) return;

      let value;
      try {
        value = mathEval.evaluate(raw);
      } catch (e) {
        // Not a math/count expression we care about
        return;
      }

      // Only integer counts are valid
      if (!Number.isFinite(value) || Math.abs(value - Math.round(value)) > 1e-9)
        return;
      value = Math.round(value);

      const expected = counting.getExpected(message.channel.id);
      const current = counting.getCurrent(message.channel.id);
      const lastUser = counting.getLastUser(message.channel.id);

      if (value !== expected) {
        await message.react("❌").catch(() => {});
        await message
          .reply(
            `No <@${message.author.id}> — you broke the count. The current number is ${expected}.`
          )
          .catch(() => {});
        counting.reset(message.channel.id);
        return;
      }

      // Prevent same user counting twice in a row
      if (lastUser === message.author.id) {
        await message.react("❌").catch(() => {});
        await message
          .reply(
            `No <@${message.author.id}> — you can't count twice in a row. The current number is ${current}.`
          )
          .catch(() => {});
        counting.reset(message.channel.id);
        return;
      }

      // Correct count
      counting.increment(message.channel.id, message.author.id);
      await message.react("✅").catch(() => {});
    } catch (err) {
      console.error("messageCreate handler error:", err);
    }
  });
};
