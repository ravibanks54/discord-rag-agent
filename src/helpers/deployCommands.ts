import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import "dotenv/config";
import commands from "../registries/commandRegistry";

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN!);

rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID!), { body: commands.mapValues(command => command.data.toJSON()) })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);