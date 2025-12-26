module.exports = {
  name: "help",
  description: "Show help information for the counting bot",
  data: {
    name: "help",
    description: "Show help information for the counting bot",
  },
  async execute(ctx) {
    const txt = [
      "**Cape.dev's Counting Bot — Commands**",
      "/start — Enable counting in this channel and reset to 0",
      "/stop — Disable counting in this channel",
      "/reset — Reset the count to 0",
      "/set <value> — Set the current count (supports math, 0x hex, 0b binary)",
      "/status — Show current count and enabled status",
      "/help — Show this message",
      "\n**Examples**",
      "1 — Correct first count",
      "2-1 — Evaluates to 1 (accepted)",
      "0xA — Hex for 10 (accepted)",
    ].join("\n");
    if (ctx && typeof ctx.reply === "function")
      return ctx.reply(txt).catch(() => {});
  },
};
