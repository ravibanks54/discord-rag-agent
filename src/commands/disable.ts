import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export const data = new SlashCommandBuilder()
    .setName('disable')
    .setDescription('Disables bot for this channel.')
    .addStringOption(option =>
        option.setName('channelurl')
            .setDescription('URL for channel')
            .setRequired(false));

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const channelUrl = interaction.options.get('channelurl');

        let channelIdToDisable = interaction.channelId;

        if (channelUrl) {
            const url = new URL(channelUrl.value! as string);
            const pathParts = url.pathname.split('/');
            channelIdToDisable = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }
        console.log(`Disabling for channel ${channelIdToDisable}.`)
        if (await enabledChannels.is_enabled(interaction.guildId!, channelIdToDisable)) {
            await enabledChannels.disable(interaction.guildId!, channelIdToDisable);
            await interaction.reply({content: 'Disabled!', ephemeral: true});
        } else {
            await interaction.reply({content: 'I am already disabled for this channel.', ephemeral: true});
        }
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }
}
