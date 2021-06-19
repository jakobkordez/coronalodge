import { MessageEmbed } from 'discord.js';

export const spotifyEmbed = (): MessageEmbed =>
  new MessageEmbed({
    color: '#1ED760',
    thumbnail: {
      url: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/intermediary/f/571e5943-4616-4654-bf99-10b3c98f8686/d98301o-426f05ca-8fe5-4636-9009-db9dd1fca1f3.png',
    },
  });
