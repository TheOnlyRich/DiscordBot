const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const JOKES = [
  { setup: "Why don't scientists trust atoms?", punchline: "Because they make up everything." },
  { setup: "Why did the scarecrow win an award?", punchline: "Because he was outstanding in his field." },
  { setup: "I'm reading a book about anti-gravity.", punchline: "It's impossible to put down." },
  { setup: "Did you hear about the mathematician who's afraid of negative numbers?", punchline: "He'll stop at nothing to avoid them." },
  { setup: "Why do cows wear bells?", punchline: "Because their horns don't work." },
  { setup: "What do you call a fake noodle?", punchline: "An impasta." },
  { setup: "Why can't you give Elsa a balloon?", punchline: "Because she'll let it go." },
  { setup: "What do you call cheese that isn't yours?", punchline: "Nacho cheese." },
  { setup: "Why did the bicycle fall over?", punchline: "Because it was two-tired." },
  { setup: "What do you call a sleeping dinosaur?", punchline: "A dino-snore." },
  { setup: "Why did the golfer bring an extra pair of pants?", punchline: "In case he got a hole in one." },
  { setup: "What do you call a fish without eyes?", punchline: "A fsh." },
  { setup: "Why can't Elsa have a balloon?", punchline: "She'll let it go." },
  { setup: "How do you organize a space party?", punchline: "You planet." },
  { setup: "What do you call a bear with no teeth?", punchline: "A gummy bear." },
  { setup: "I told my wife she was drawing her eyebrows too high.", punchline: "She looked surprised." },
  { setup: "Why don't eggs tell jokes?", punchline: "They'd crack each other up." },
  { setup: "What's a skeleton's least favourite room in the house?", punchline: "The living room." },
  { setup: "Why did the math book look so sad?", punchline: "Because it had too many problems." },
  { setup: "What do you call a factory that makes okay products?", punchline: "A satisfactory." },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),

  async execute(interaction) {
    const joke = JOKES[Math.floor(Math.random() * JOKES.length)];

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xfee75c)
          .setTitle('😄 ' + joke.setup)
          .setDescription(joke.punchline)
      ],
    });
  },
};
