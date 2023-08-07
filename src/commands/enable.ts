import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    console.log(`Enabling for channel ${interaction.channelId}.`)
    if (await enabledChannels.is_enabled(interaction.guildId!, interaction.channelId)) {
        await interaction.reply({content: 'I am already enabled for this channel.', ephemeral: true});
    } else {
        await enabledChannels.enable(interaction.guildId!, interaction.channelId);
        await interaction.reply({content: 'Enabled!', ephemeral: true});
    }
}
