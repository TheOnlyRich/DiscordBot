const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flip a coin'),

  async execute(interaction) {
    const heads = Math.random() < 0.5;

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(heads ? 0xfee75c : 0x9295b0)
          .setTitle(heads ? '🪙 Heads!' : '🪙 Tails!')
          .setDescription(heads ? 'The coin landed on **heads**.' : 'The coin landed on **tails**.')
      ],
    });
  },
};
