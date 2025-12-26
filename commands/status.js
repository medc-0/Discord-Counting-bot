module.exports = {
  name: "status",
  description: "Show current count and enabled status for this channel",
  data: {
    name: "status",
    description: "Show current count and enabled status for this channel",
  },
  async execute(ctx, args, { counting }) {
    const channelId = ctx.channelId || (ctx.channel && ctx.channel.id);
    const enabled = counting.isEnabled(channelId || ctx.channel.id);
    const current = counting.getCurrent(channelId || ctx.channel.id);
    if (ctx && typeof ctx.reply === "function")
      return ctx
        .reply(`Enabled: ${enabled} — Current: ${current}`)
        .catch(() => {});
  },
};
