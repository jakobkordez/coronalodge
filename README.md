# Coronalodge bot

## Enviromantal variables

Support for `.env` file

| Variable          | Type     | Description                |
| ----------------- | -------- | -------------------------- |
| `DISCORD_TOKEN`   | `String` | Discord bot token          |
| `SPOTIFY_ID`      | `String` | Spotify App Client ID      |
| `SPOTIFY_SECRET`  | `String` | Spotify App Client Secret  |
| `SPOTIFY_REFRESH` | `String` | Spotify User Refresh Token |

## Setup

```
npm install
npm run build

npm run start:prod
```

## Commands

| Command                    | Description              |
| -------------------------- | ------------------------ |
| `cl!playlists`             | List all playlists       |
| `cl!playlist create :name` | Create new playlist      |
| `cl!playlist delete :id`   | Delete playlist          |
| `cl!playlist bind :id`     | Bind channel to playlist |
| `cl!playlist unbind`       | Unbind channel           |
