const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('announce')
    .setDescription('Post a formatted announcement in this channel')
    .addStringOption(opt =>
      opt.setName('title')
        .setDescription('Announcement title')
        .setRequired(true)
        .setMaxLength(256)
    )
    .addStringOption(opt =>
      opt.setName('message')
        .setDescription('Announcement body')
        .setRequired(true)
        .setMaxLength(2000)
    )
    .addStringOption(opt =>
      opt.setName('color')
        .setDescription('Accent color')
        .setRequired(false)
        .addChoices(
          { name: 'Blue (default)', value: 'blue' },
          { name: 'Green', value: 'green' },
          { name: 'Red', value: 'red' },
          { name: 'Yellow', value: 'yellow' },
          { name: 'Purple', value: 'purple' },
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const title = interaction.options.getString('title');
    const message = interaction.options.getString('message');
    const colorChoice = interaction.options.getString('color') ?? 'blue';

    const colors = {
      blue:   0x5865F2,
      green:  0x57f287,
      red:    0xed4245,
      yellow: 0xfee75c,
      purple: 0xa78bfa,
    };

    const embed = new EmbedBuilder()
      .setColor(colors[colorChoice])
      .setTitle('📢 ' + title)
      .setDescription(message)
      .setTimestamp()
      .setFooter({ text: `Announced by ${interaction.user.tag}` });

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Announcement posted!', ephemeral: true });
  },
};
