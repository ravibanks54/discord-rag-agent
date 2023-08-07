import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        console.log(`Disabling for channel ${interaction.channelId}.`)
        if (await enabledChannels.is_enabled(interaction.guildId!, interaction.channelId)) {
            await enabledChannels.disable(interaction.guildId!, interaction.channelId);
            await interaction.reply({content: 'Disabled!', ephemeral: true});
        } else {
            await interaction.reply({content: 'I am already disabled for this channel.', ephemeral: true});
        }
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }
}