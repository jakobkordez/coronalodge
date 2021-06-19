import { User } from './user.interface';

export interface Playlist {
  colaborative: false;
  description: string;
  external_urls: { spotify: string };
  id: string;
  name: string;
  owner: User;
  public: boolean;
  tracks: { total: number };
  uri: string;
}
