import { Command, CommandMessage, Discord, Guard } from '@typeit/discord';
import { EmbedFieldData } from 'discord.js';
import { IsAdmin } from '../guards/admin.guard';
import { IsNotBot } from '../guards/notbot.guard';
import { spotifyEmbed } from '../helpers/embed.helpers';
import { Playlist } from '../interfaces/playlist.interface';
import { playlistService } from '../services/playlist.service';
import { spotifyService } from '../services/spotify.service';

@Discord('cl!')
export class CommandsModule {
  @Command('playlists')
  @Guard(IsNotBot, IsAdmin)
  public async getPlaylists(message: CommandMessage): Promise<void> {
    const page: number = message.args['page'] || 1;

    const playlists = await spotifyService.getPlaylists(page, 4);

    if (playlists.total === 0) {
      await message.channel.send(
        spotifyEmbed()
          .setTitle('No playlists yet')
          .setDescription('Add a playlist with `cl!playlist create [name]`')
          .setThumbnail(''),
      );
      return;
    }

    const embed = spotifyEmbed()
      .setTitle(`Playlists - Page ${page}`)
      .addFields(playlists.items.map((pl) => this.mapPlaylist(pl)));

    if (!playlists.next && page === 1) embed.setTitle('All playlists');

    const rmsg = await message.channel.send(embed);
    if (playlists.previous) await rmsg.react('⬅️');
    if (playlists.next) await rmsg.react('➡️');
  }

  private mapPlaylist(pl: Playlist): EmbedFieldData {
    if (!pl) return { name: '\u200B', value: '\u200B' };
    return {
      name: `${pl.name}`,
      value: `*ID:* ${pl.id}`, //\n${pl.tracks.total} songs`,
    };
  }

  @Command('playlist create')
  @Guard(IsNotBot, IsAdmin)
  public async newPlaylist(message: CommandMessage): Promise<void> {
    const name: string = message.commandContent.substr(16);
    if (!name) return;

    await spotifyService.createPlaylist(name);
    message.channel.send(
      spotifyEmbed()
        .setTitle('Playlist created')
        .setDescription(
          `Name: **${name}**\n\nSee all playlists with \`cl!playlists\``,
        )
        .setThumbnail(''),
    );
  }

  @Command('playlist delete :id')
  @Guard(IsNotBot, IsAdmin)
  public async deletePlaylist(message: CommandMessage): Promise<void> {
    try {
      await spotifyService.unfollowPlaylist(message.args['id']);
      message.channel.send(
        spotifyEmbed()
          .setTitle('Deleted playlist!')
          .setDescription('To recover the playlist contact Jakob')
          .setThumbnail(''),
      );
    } catch {
      message.channel.send(
        spotifyEmbed().setTitle('Failed to delete playlist!').setThumbnail(''),
      );
    }
  }

  @Command('playlist bind :id')
  @Guard(IsNotBot, IsAdmin)
  public async bindPlaylistChannel(message: CommandMessage): Promise<void> {
    const playlistId: string = message.args['id'];

    if (!playlistId) {
      message.channel.send(
        spotifyEmbed()
          .setTitle('Failed to bind playlist')
          .setDescription('Missing playlist id')
          .setThumbnail(''),
      );
      return;
    }
    if (playlistService.isBound(message.channel.id)) {
      message.channel.send(
        spotifyEmbed()
          .setTitle('Failed to bind playlist')
          .setDescription('Channel already bound')
          .setThumbnail(''),
      );
      return;
    }

    try {
      const playlist = await spotifyService.getPlaylist(playlistId);
      // if (playlist.owner.id != )
      playlistService.bind(message.channel.id, playlistId);
      message.channel.send(
        spotifyEmbed()
          .setTitle('Playlist bound')
          .setDescription(`*${playlist.name}* bound to this channel`)
          .setThumbnail(''),
      );
    } catch {
      message.channel.send(
        spotifyEmbed()
          .setTitle('Failed to bind playlist')
          .setDescription('No such playlist')
          .setThumbnail(''),
      );
    }
  }

  @Command('playlist unbind')
  @Guard(IsNotBot, IsAdmin)
  public async unbindPlaylistChannel(message: CommandMessage): Promise<void> {
    if (!playlistService.isBound(message.channel.id)) {
      message.channel.send(
        spotifyEmbed()
          .setTitle('Failed to unbind playlist')
          .setDescription('Channel not bound')
          .setThumbnail(''),
      );
      return;
    }

    playlistService.unbind(message.channel.id);
    message.channel.send(
      spotifyEmbed()
        .setTitle('Playlist unbound')
        .setDescription('Successfully unbound this channel')
        .setThumbnail(''),
    );
  }
}
