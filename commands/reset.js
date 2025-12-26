module.exports = {
  name: "reset",
  description: "Reset the current count to 0",
  data: { name: "reset", description: "Reset the current count to 0" },
  async execute(ctx, args, { counting }) {
    const channelId = ctx.channelId || (ctx.channel && ctx.channel.id);
    const reply = async (t) => {
      if (ctx && typeof ctx.reply === "function")
        return ctx.reply(typeof t === "string" ? t : t);
    };
    counting.reset(channelId || ctx.channel.id);
    await reply("Count reset to 0 for this channel.").catch(() => {});
  },
};
