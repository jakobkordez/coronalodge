import { Client } from '@typeit/discord';
import { AppModule } from './modules/app.module';
import { CommandsModule } from './modules/commands.module';
import { env, loadEnv } from './env';
import { PlaylistModule } from './modules/playlist.module';

loadEnv();

async function start() {
  const client = new Client({
    classes: [AppModule, CommandsModule, PlaylistModule],
    silent: false,
    variablesChar: ':',
  });

  await client.login(env.DISCORD_TOKEN);
}

start();
