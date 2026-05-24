const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),

  async execute(interaction) {
    const commands = interaction.client.commands;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Available Commands')
      .setDescription('Here\'s everything I can do:')
      .setFooter({ text: 'Use / to trigger any command' });

    for (const [, cmd] of commands) {
      embed.addFields({
        name: `/${cmd.data.name}`,
        value: cmd.data.description,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
