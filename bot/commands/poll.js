const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const EMOJIS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll with up to 4 options')
    .addStringOption(opt =>
      opt.setName('question')
        .setDescription('The poll question')
        .setRequired(true)
        .setMaxLength(256)
    )
    .addStringOption(opt =>
      opt.setName('option1')
        .setDescription('First option')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption(opt =>
      opt.setName('option2')
        .setDescription('Second option')
        .setRequired(true)
        .setMaxLength(100)
    )
    .addStringOption(opt =>
      opt.setName('option3')
        .setDescription('Third option')
        .setRequired(false)
        .setMaxLength(100)
    )
    .addStringOption(opt =>
      opt.setName('option4')
        .setDescription('Fourth option')
        .setRequired(false)
        .setMaxLength(100)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = [
      interaction.options.getString('option1'),
      interaction.options.getString('option2'),
      interaction.options.getString('option3'),
      interaction.options.getString('option4'),
    ].filter(Boolean);

    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(`📊 ${question}`)
      .setDescription(options.map((opt, i) => `${EMOJIS[i]}  ${opt}`).join('\n\n'))
      .setFooter({ text: `Poll by ${interaction.user.tag} · React to vote` });

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });

    for (let i = 0; i < options.length; i++) {
      await msg.react(EMOJIS[i]);
    }
  },
};
