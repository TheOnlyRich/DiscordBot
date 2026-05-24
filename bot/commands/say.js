const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Make the bot send a message in this channel')
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('The message to send')
        .setRequired(true)
        .setMaxLength(2000)
    )
    // Only server moderators can use this to prevent abuse
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const message = interaction.options.getString('message');
    await interaction.channel.send(message);
    await interaction.reply({ content: 'Message sent!', ephemeral: true });
  },
};
