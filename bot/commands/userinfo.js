const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Get information about a user')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('The user to look up (defaults to you)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser('user') ?? interaction.user;
    const member = await interaction.guild.members.fetch(target.id).catch(() => null);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(target.tag)
      .setThumbnail(target.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'User ID', value: target.id, inline: true },
        { name: 'Account Created', value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
        { name: 'Nickname', value: member.nickname ?? 'None', inline: true },
        { name: 'Top Role', value: member.roles.highest.toString(), inline: true },
      );
    }

    await interaction.reply({ embeds: [embed] });
  },
};
