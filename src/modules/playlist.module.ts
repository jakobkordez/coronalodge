import {
  Command,
  CommandMessage,
  Discord,
  Guard,
  Rules,
} from '@typeit/discord';
import { Message, MessageReaction } from 'discord.js';
import { IsNotBot } from '../guards/notbot.guard';
import { spotifyEmbed } from '../helpers/embed.helpers';
import { Track } from '../interfaces/track.interface';
import { playlistService } from '../services/playlist.service';
import { requestService } from '../services/request.service';
import { spotifyService } from '../services/spotify.service';

const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
const cancelEmoji = '❌';

@Discord()
export class PlaylistModule {
  // @Rules(/^\s*\w+(\s+\w+)*\s*-\s*\w+(\s+\w+)*\s*$/)
  @Command()
  @Rules(/.*/)
  @Guard(IsNotBot)
  public async addSong(message: CommandMessage): Promise<void> {
    if (!playlistService.isBound(message.channel.id)) return;

    console.log('Searching', message.content);

    const results = (
      await spotifyService.searchTrack(message.content)
    ).items.slice(0, 5);

    if (results.length === 0) {
      message.channel.send(
        spotifyEmbed().setTitle('Search results').setDescription('No results'),
      );
      return;
    }

    const rmsg = await message.channel.send(
      spotifyEmbed()
        .setTitle('Search results')
        .setDescription(
          results
            .map(
              (trk, i) => `\`${i + 1})\` ${trk.artists[0].name} : ${trk.name}`,
            )
            .join('\n'),
        ),
    );

    requestService.new({
      message_id: rmsg.id,
      track_ids: results.map((trk) => trk.id),
    });

    reactions
      .slice(0, results.length)
      .forEach(async (val) => await rmsg.react(val));
    await rmsg.react(cancelEmoji);

    rmsg
      .awaitReactions(this.filter, { max: 1, time: 60000, errors: ['time'] })
      .then(([[_, reaction]]) => this.onMessageReaction(rmsg, reaction))
      .catch(() => this.onMessageReactionExpire(rmsg));
  }

  private filter(reaction: MessageReaction): boolean {
    return [...reactions, cancelEmoji].includes(reaction.emoji.name);
  }

  private async onMessageReaction(
    message: Message,
    reaction: MessageReaction,
  ): Promise<void> {
    if (reaction.emoji.name === cancelEmoji) {
      if (!requestService.delete(message.id)) return;
      message.edit(
        spotifyEmbed()
          .setTitle('Song selection canceled ' + cancelEmoji)
          .setThumbnail(''),
      );
      message.reactions.removeAll();
      return;
    }

    const index = reactions.indexOf(reaction.emoji.name);
    const track_id = requestService.pick(message.id, index);
    if (!track_id) return;

    const playlist = playlistService.getPlaylist(message.channel.id);

    const track: Track = await spotifyService.getTrack(track_id);

    message.reactions.removeAll();
    await spotifyService.addTrackToPlaylist(playlist, track.id);
    message.edit(
      spotifyEmbed()
        .setTitle('Added song to playlist')
        .addField(
          track.name,
          track.artists.map((artist) => artist.name).join(', '),
        ),
    );
  }

  private async onMessageReactionExpire(message: Message): Promise<void> {
    if (!requestService.delete(message.id)) return;
    message.edit(
      spotifyEmbed().setTitle('Song selection expired ⏲️').setThumbnail(''),
    );
    message.reactions.removeAll();
  }
}
