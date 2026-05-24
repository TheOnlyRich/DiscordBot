const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
  { text: "When you reach the end of your rope, tie a knot in it and hang on.", author: "Franklin D. Roosevelt" },
  { text: "Always remember that you are absolutely unique. Just like everyone else.", author: "Margaret Mead" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "You will face many defeats in life, but never let yourself be defeated.", author: "Maya Angelou" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas Edison" },
  { text: "You have brains in your head. You have feet in your shoes. You can steer yourself any direction you choose.", author: "Dr. Seuss" },
  { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
  { text: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
  { text: "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.", author: "James Cameron" },
  { text: "Life is not measured by the number of breaths we take, but by the moments that take our breath away.", author: "Maya Angelou" },
  { text: "If you want to live a happy life, tie it to a goal, not to people or things.", author: "Albert Einstein" },
  { text: "Never let the fear of striking out keep you from playing the game.", author: "Babe Ruth" },
  { text: "Money and success don't change people; they merely amplify what is already there.", author: "Will Smith" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Not how long, but how well you have lived is the main thing.", author: "Seneca" },
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a random inspirational quote'),

  async execute(interaction) {
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0xa78bfa)
          .setTitle('💬 Quote')
          .setDescription(`*"${quote.text}"*`)
          .setFooter({ text: `— ${quote.author}` })
      ],
    });
  },
};
