module.exports = (client, commands = new Map()) => {
  client.once("ready", async () => {
    console.log(`Logged in as ${client.user.tag}`);
    try {
      client.user.setActivity("Counting");
    } catch (e) {}

    // Register slash commands (global)
    try {
      const toRegister = [];
      for (const cmd of commands.values()) {
        if (cmd.data) toRegister.push(cmd.data);
        else
          toRegister.push({
            name: cmd.name,
            description: cmd.description || "No description",
          });
      }
      if (client.application) {
        await client.application.commands.set(toRegister);
        console.log(
          "Registered slash commands:",
          toRegister.map((c) => c.name)
        );
      }
    } catch (e) {
      console.error("Failed to register slash commands:", e);
    }

    // Interaction handler for slash commands
    client.on("interactionCreate", async (interaction) => {
      try {
        if (!interaction.isChatInputCommand()) return;
        const cmd = commands.get(interaction.commandName);
        if (!cmd) return;
        await cmd.execute(interaction, interaction.options, {
          client,
          counting: require("../utils/countingManager"),
          mathEval: require("../utils/mathEvaluator"),
        });
      } catch (e) {
        console.error("Interaction handling error:", e);
        try {
          if (!interaction.replied)
            await interaction.reply({
              content: "Command failed",
              ephemeral: true,
            });
        } catch (__) {}
      }
    });
  });
};
