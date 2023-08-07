import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    console.log(`Disabling for channel ${interaction.channelId}.`)
    if (await enabledChannels.is_enabled(interaction.guildId!, interaction.channelId)) {
        await enabledChannels.disable(interaction.guildId!, interaction.channelId);
        await interaction.reply({content: 'Disabled!', ephemeral: true});
    } else {
        await interaction.reply({content: 'I am already disabled for this channel.', ephemeral: true});
    }
}
