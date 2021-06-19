import { Artist } from './artist.interface';

export interface Track {
  artists: Artist[];
  duration_ms: number;
  explicit: boolean;
  id: string;
  name: string;
  uri: string;
}
