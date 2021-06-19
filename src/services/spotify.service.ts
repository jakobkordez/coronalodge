import axios from 'axios';
import { stringify } from 'querystring';
import { env } from '../env';
import { Paging } from '../interfaces/paging.interface';
import { Playlist } from '../interfaces/playlist.interface';
import { PlaylistTrack } from '../interfaces/playlist.track.interface';
import { Track } from '../interfaces/track.interface';

export class SpotifyService {
  private accessToken: { token: string; expires: number };

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.accessToken.expires > Date.now())
      return this.accessToken.token;

    const res = await axios.post(
      'https://accounts.spotify.com/api/token',
      stringify({
        grant_type: 'refresh_token',
        refresh_token: env.SPOTIFY_REFRESH,
      }),
      {
        auth: { username: env.SPOTIFY_ID, password: env.SPOTIFY_SECRET },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    this.accessToken = {
      expires: Date.now() + res.data['expires_in'] - 10,
      token: res.data['access_token'],
    };
    return this.accessToken.token;
  }

  private async getHeaders(
    auth = true,
    content_type: 'json' | 'x-www-form-urlencoded' = 'json',
  ): Promise<Record<string, string>> {
    const headers = {
      'Content-Type': content_type,
    };
    if (auth)
      headers['Authorization'] = `Bearer ${await this.getAccessToken()}`;

    return headers;
  }

  public async getNextPage<T>(paging: Paging<T>): Promise<Paging<T>> {
    if (!paging.next) return null;

    const res = await axios.get(paging.next, {
      headers: await this.getHeaders(),
    });

    return res.data as Paging<T>;
  }

  public async getPlaylists(
    page = 1,
    pageSize = 10,
  ): Promise<Paging<Playlist>> {
    const offset = (page - 1) * pageSize;
    const res = await axios.get(
      `https://api.spotify.com/v1/me/playlists?limit=${pageSize}&offset=${offset}`,
      { headers: await this.getHeaders() },
    );

    return res.data as Paging<Playlist>;
  }

  public async getPlaylist(id: string): Promise<Playlist> {
    const res = await axios.get(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: await this.getHeaders(),
    });

    return res.data as Playlist;
  }

  public async createPlaylist(name: string): Promise<void> {
    await axios.post(
      'https://api.spotify.com/v1/me/playlists',
      { name },
      { headers: await this.getHeaders() },
    );
  }

  public async unfollowPlaylist(id: string): Promise<void> {
    await axios.delete(`https://api.spotify.com/v1/playlists/${id}/followers`, {
      headers: await this.getHeaders(),
    });
  }

  public async getPlaylistTracks(id: string): Promise<Paging<PlaylistTrack>> {
    const res = await axios.get(
      `https://api.spotify.com/v1/playlists/${id}/tracks`,
      { headers: await this.getHeaders() },
    );

    return res.data as Paging<PlaylistTrack>;
  }

  public async addTrackToPlaylist(
    playlist_id: string,
    track_id: string,
  ): Promise<void> {
    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
      { uris: [`spotify:track:${track_id}`] },
      { headers: await this.getHeaders() },
    );
  }

  public async getTrack(id: string): Promise<Track> {
    const res = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: await this.getHeaders(),
    });

    return res.data as Track;
  }

  public async searchTrack(query: string): Promise<Paging<Track>> {
    const equery = encodeURIComponent(query);
    const res = await axios.get(
      `https://api.spotify.com/v1/search?type=track&q=${equery}`,
      { headers: await this.getHeaders() },
    );

    return res.data['tracks'] as Paging<Track>;
  }
}

export const spotifyService: SpotifyService = new SpotifyService();
