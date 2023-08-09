import {Client, Intents} from "discord.js";
import "dotenv/config";
import eventHandlers from "./registries/eventHandlerRegistry";


const discordClient = new Client({
  presence: {
    status: "online",
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
}) as Client;

discordClient.once("ready", async () => {
  console.log(`Logged in as: ${discordClient.user?.tag}`);
});

// Register all handlers.
for (const [eventName, eventHandler] of eventHandlers) {
  console.log(`Registering event ${eventName}`)
  discordClient.on(eventName, eventHandler);
}


discordClient.login(process.env.DISCORD_TOKEN);

export default discordClient;
