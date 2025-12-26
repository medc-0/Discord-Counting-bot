module.exports = {
  name: "start",
  description: "Start counting in this channel",
  data: { name: "start", description: "Start counting in this channel" },
  async execute(ctx, args, { counting }) {
    const channelId =
      ctx.channelId ||
      (ctx.channel && ctx.channel.id) ||
      (ctx.channel && ctx.channelId);
    const reply = async (t) => {
      if (ctx && typeof ctx.reply === "function")
        return ctx.reply(typeof t === "string" ? t : t);
    };
    counting.enable(channelId || ctx.channel.id);
    counting.reset(channelId || ctx.channel.id);
    await reply("Counting started in this channel. Send `1` to begin.").catch(
      () => {}
    );
  },
};
