import { configService } from './config.service';

export class PlaylistService {
  public isBound(channelId: string): boolean {
    return !!configService.getBind(channelId);
  }

  public getPlaylist(channelId: string): string {
    return configService.getBind(channelId);
  }

  public bind(channelId: string, playlist: string): void {
    configService.bind(channelId, playlist);
  }

  public unbind(channelId: string): void {
    configService.unbind(channelId);
  }
}

export const playlistService: PlaylistService = new PlaylistService();
