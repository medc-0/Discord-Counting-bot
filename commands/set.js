module.exports = {
  name: "set",
  description:
    "Set the current count to a number (supports math/hex/binary expressions)",
  data: {
    name: "set",
    description: "Set the current count to a number",
    options: [
      {
        name: "value",
        type: 3,
        description: "Number or expression",
        required: true,
      },
    ],
  },
  async execute(ctx, args, { counting, mathEval }) {
    // args may be array (from prefix) or InteractionOptionResolver
    let raw;
    if (Array.isArray(args)) raw = args.join(" ").trim();
    else raw = args.getString("value") || "";

    const reply = async (t, ephemeral = false) => {
      if (ctx && typeof ctx.reply === "function")
        return ctx.reply({ content: typeof t === "string" ? t : t, ephemeral });
    };

    if (!raw) return reply("Usage: /set <number|expression>").catch(() => {});
    let value;
    try {
      value = mathEval.evaluate(raw);
    } catch (e) {
      return reply("Invalid expression.").catch(() => {});
    }
    if (!Number.isFinite(value) || Math.abs(value - Math.round(value)) > 1e-9) {
      return reply("Value must be an integer.").catch(() => {});
    }
    value = Math.round(value);
    const channelId = ctx.channelId || (ctx.channel && ctx.channel.id);
    counting.set(channelId || ctx.channel.id, value, null);
    await reply(`Count set to ${value} for this channel.`).catch(() => {});
  },
};
