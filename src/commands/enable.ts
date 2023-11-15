import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";
import guildConfig from '../persistence/guildConfig';

export const data = new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables bot for the current channel (or a channel of your choice).')
    .addStringOption(option =>
        option.setName('channelurl')
            .setDescription('URL for channel')
            .setRequired(false));

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const guildConfigExists = Boolean(await guildConfig.get(interaction.guildId!));
        if (!guildConfigExists) {
            await interaction.reply({content: 'Please configure me first using the /configure command.', ephemeral: true});
        }

        const channelUrl = interaction.options.get('channelurl');

        let channelIdToEnable = interaction.channelId;

        if (channelUrl) {
            const url = new URL(channelUrl.value! as string);
            const pathParts = url.pathname.split('/');
            channelIdToEnable = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
        }

        console.log(`Enabling for channel ${channelIdToEnable}.`)
        if (await enabledChannels.is_enabled(interaction.guildId!, channelIdToEnable)) {
            await interaction.reply({content: 'I am already enabled for this channel.', ephemeral: true});
        } else {
            await enabledChannels.enable(interaction.guildId!, channelIdToEnable);
            await interaction.reply({content: 'Enabled!', ephemeral: true});
        }
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }

}
