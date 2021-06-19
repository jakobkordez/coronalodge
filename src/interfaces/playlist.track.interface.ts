import { Track } from './track.interface';
import { User } from './user.interface';

export interface PlaylistTrack {
  added_at: string;
  added_by: User;
  track: Track;
}
