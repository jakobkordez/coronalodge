import { Client, Discord, On } from '@typeit/discord';

@Discord()
export class AppModule {
  @On('ready')
  public ready(_: void, client: Client): void {
    console.log('\nReady!\nServers:');
    for (const guild of client.guilds.cache) console.log('  ->', guild[1].name);
  }
}
