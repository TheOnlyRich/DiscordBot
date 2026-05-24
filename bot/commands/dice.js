const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dice')
    .setDescription('Roll one or more dice')
    .addIntegerOption(opt =>
      opt.setName('sides')
        .setDescription('Number of sides on each die (default: 6)')
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    )
    .addIntegerOption(opt =>
      opt.setName('count')
        .setDescription('How many dice to roll (default: 1)')
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? 6;
    const count = interaction.options.getInteger('count') ?? 1;

    const rolls = Array.from({ length: count }, () => Math.floor(Math.random() * sides) + 1);
    const total = rolls.reduce((a, b) => a + b, 0);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`🎲 Rolling ${count}d${sides}`)
      .addFields({ name: count === 1 ? 'Result' : 'Rolls', value: rolls.join('  '), inline: true });

    if (count > 1) {
      embed.addFields({ name: 'Total', value: `**${total}**`, inline: true });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
