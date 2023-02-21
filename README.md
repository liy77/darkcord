<div align="center">
	<br />
    	<p>
		<img src="https://media.discordapp.net/attachments/903700220259487767/1068110112687935518/darkcord.png" width="546" alt="darkcord" />
	</p>
    <br />
    	<p>
		<a href="https://github.com/denkylabs/darkcord/actions"><img src="https://github.com/denkylabs/darkcord/actions/workflows/tests.yml/badge.svg" alt="Tests status" /></a>
	</p>
</div>

## About

Darkcord is a [Node.js](https://nodejs.org) module to easily interact with
[Discord API](https://discord.com/developers/docs/intro).

## Installation

**Node.js 16.9.0 or newer is required to installation.**

```sh-session
npm install darkcord
yarn add darkcord
pnpm add darkcord
```

## Example Usage

### Gateway Example

```js
import { Client, Constants } from "darkcord";

const GatewayIntentBits = Constants.GatewayIntentBits;
const ClientIntents =
  GatewayIntentBits.Guilds |
  GatewayIntentBits.GuildMessage |
  GatewayIntentBits.MessageContent;

const client = new Client("token", {
  gateway: {
    intents: ClientIntents,
  },
});

client.on("ready", () => {
  console.log(`Connected to Discord Gateway`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.reply({ content: "Pong!" });
  }
});

client.connect();
```

### HTTP Interactions Example

```js
import { InteractionClient } from "darkcord";

const client = new InteractionClient("public key", {
  rest: {
    token: "token",
  },
  webserver: {
    port: 8080,
  },
});

client.on("connect", () => {
  console.log("Listening on port 8080");
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    await interaction.reply({ content: "Pong!" });
  }
});

client.connect();
```

### Voice

#### Install voice packages

```sh-session
npm install shoukaku
yarn add shoukaku
pnpm add shoukaku

npm install kazagumo
yarn add kazagumo
pnpm add kazagumo
```

##### Spotify

```sh-session
npm install kazagumo-spotify
yarn add kazagumo-spotify
pnpm add kazagumo-spotify
```

```js
import { Client } from "darkcord";
import { Lava } from "@darkcord/lava";

const Nodes = [
  {
    name: "Node 1",
    url: "localhost:2333",
    auth: "youshallnotpass",
    secure: false,
  },
];

const voicePlugin = Lava({
  nodes: Nodes,
  defaultSearchEngine: "youtube",
});

const client = new Client("token", {
  gateway: {
    intents: YOUR_INTENTS,
  },
  plugins: [voicePlugin],
});

client.lava.lavalink.on("ready", (node) => console.log(`Node ${node} is Ready`));

client.lava.on("playerStart", (player) => {
  client.channels.cache.get(player.textId).createMessage({
    content: `Now playing **${track.title}** by **${track.author}**`,
  });
});

client.on("ready", () => console.log("Client is Ready"));

client.connect();
```

## Useful Links

- [Website](https://darkcord.denkylabs.com)
- [GitHub](https://github.com/denkylabs/darkcord)
- [npm](https://npmjs.com/package/darkcord)
- [Discord API Discord server](https://discord.gg/discord-api)
- [Denky Labs Discord server](https://discord.gg/98DNuKDx8j)
