import { EnvSchema, EnvType, load } from 'ts-dotenv';

export type Env = EnvType<typeof schema>;

export const schema: EnvSchema = {
  DISCORD_TOKEN: String,
  NODE_ENV: {
    type: ['production', 'development'],
    default: 'development',
  },
  DEV_SERVER_ID: {
    type: String,
    optional: true,
  },
  SPOTIFY_ID: String,
  SPOTIFY_SECRET: String,
  SPOTIFY_REFRESH: String,
};

export let env: Env;

export function loadEnv(): void {
  env = load(schema);
}
