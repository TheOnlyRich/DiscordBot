const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const FACTS = [
  'Honey never spoils. Archaeologists have found 3,000-year-old honey in Egyptian tombs that was still perfectly edible.',
  'A day on Venus is longer than a year on Venus — it rotates so slowly that it completes an orbit before one full spin.',
  'Octopuses have three hearts, nine brains, and blue blood.',
  'The shortest war in history lasted 38–45 minutes: the Anglo-Zanzibar War of 1896.',
  'Bananas are berries, but strawberries are not — botanically speaking.',
  'There are more stars in the observable universe than grains of sand on all of Earth\'s beaches.',
  'A group of flamingos is called a flamboyance.',
  'Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.',
  'Sharks are older than trees. Sharks have existed for ~450 million years; trees only ~350 million.',
  'A bolt of lightning is five times hotter than the surface of the Sun.',
  'Wombats are the only animals known to produce cube-shaped droppings.',
  'The number of possible games of chess is greater than the number of atoms in the observable universe.',
  'The Eiffel Tower can be 15 cm taller in summer due to thermal expansion of the iron.',
  'A snail can sleep for up to three years.',
  'Crows can recognize and remember individual human faces — and hold grudges.',
  'It rains diamonds on Neptune and Uranus due to extreme heat and pressure.',
  'The inventor of the Pringles can, Fredric Baur, had his ashes buried in one.',
  'Cats lack the taste receptors to detect sweetness.',
  'The fingerprints of a koala are nearly indistinguishable from human fingerprints.',
  'Oxford University is older than the Aztec Empire.',
  'Humans share about 60% of their DNA with bananas.',
  'The average person walks the equivalent of three times around the world in a lifetime.',
  'There are more possible shuffles of a standard deck of cards than atoms on Earth.',
  'Polar bear fur is actually transparent, not white — it appears white due to how it reflects light.',
  'A group of owls is called a parliament.',
  'The heart of a blue whale is so large a human could crawl through its arteries.',
  'Pterodactyls went extinct before Tyrannosaurus Rex even existed.',
  'You cannot hum while holding your nose closed.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('funfact')
    .setDescription('Get a random fun fact'),

  async execute(interaction) {
    const index = Math.floor(Math.random() * FACTS.length);

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(0x57f287)
          .setTitle('💡 Fun Fact')
          .setDescription(FACTS[index])
          .setFooter({ text: `Fact ${index + 1} of ${FACTS.length}` })
      ],
    });
  },
};
