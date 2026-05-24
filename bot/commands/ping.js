const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle('Pong!')
      .addFields(
        { name: 'Roundtrip', value: `${latency}ms`, inline: true },
        { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true }
      );

    await interaction.editReply({ content: '', embeds: [embed] });
  },
};
