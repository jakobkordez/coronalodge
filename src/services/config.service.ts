import { readFileSync, writeFileSync } from 'fs';
import { Config } from '../interfaces/config.interface';

const configFile = 'config.json';

export class ConfigService {
  private config: Config;

  constructor() {
    try {
      const data = readFileSync(configFile, { encoding: 'utf8' });
      const parsedData: Config = JSON.parse(data);
      this.config = { boundPlaylists: new Map(parsedData.boundPlaylists) };
    } catch (e) {
      this.config = { boundPlaylists: new Map() };

      this.save();
    }
  }

  public getBind(channelId: string): string {
    return this.config.boundPlaylists.get(channelId);
  }

  public unbind(channelId: string): void {
    this.config.boundPlaylists.delete(channelId);
    this.save();
  }

  public bind(channelId: string, playlist: string): void {
    this.config.boundPlaylists.set(channelId, playlist);
    this.save();
  }

  private save(): void {
    writeFileSync(
      configFile,
      JSON.stringify(this.config, (_, value) => {
        if (value instanceof Map) return Array.from(value);
        return value;
      }),
    );
  }
}

export const configService: ConfigService = new ConfigService();
