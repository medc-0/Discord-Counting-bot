module.exports = {
  name: "stop",
  description: "Stop counting in this channel",
  data: { name: "stop", description: "Stop counting in this channel" },
  async execute(ctx, args, { counting }) {
    const channelId = ctx.channelId || (ctx.channel && ctx.channel.id);
    const reply = async (t) => {
      if (ctx && typeof ctx.reply === "function")
        return ctx.reply(typeof t === "string" ? t : t);
    };
    counting.disable(channelId || ctx.channel.id);
    await reply("Counting stopped in this channel.").catch(() => {});
  },
};
