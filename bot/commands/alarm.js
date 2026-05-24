const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('alarm')
    .setDescription('Set a reminder that fires in this channel')
    .addIntegerOption(opt =>
      opt.setName('minutes')
        .setDescription('How many minutes from now (1–1440)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(1440)
    )
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('What to remind you about')
        .setRequired(true)
        .setMaxLength(200)
    ),

  async execute(interaction) {
    const minutes = interaction.options.getInteger('minutes');
    const message = interaction.options.getString('message');
    const fireAt = Math.floor((Date.now() + minutes * 60 * 1000) / 1000);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x5865F2)
          .setTitle('⏰ Alarm Set')
          .addFields(
            { name: 'Message', value: message },
            { name: 'Fires', value: `<t:${fireAt}:R> at <t:${fireAt}:t>` }
          )
      ]
    });

    setTimeout(async () => {
      try {
        await interaction.channel.send({
          content: `⏰ <@${interaction.user.id}>`,
          embeds: [
            new EmbedBuilder()
              .setColor(0xfee75c)
              .setTitle('⏰ Alarm!')
              .setDescription(message)
              .setFooter({ text: `Set by ${interaction.user.tag}` })
          ],
        });
      } catch {
        // Channel may have been deleted or bot lost access
      }
    }, minutes * 60 * 1000);
  },
};
