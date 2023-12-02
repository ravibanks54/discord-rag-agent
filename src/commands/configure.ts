import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import guildConfig from '../persistence/guildConfig';
import channelConfig from "../persistence/channelConfig";

export const data = new SlashCommandBuilder()
    .setName('configure')
    .setDescription('Sets the API Key and Agent ID for this bot.')
    .addStringOption(option =>
        option.setName('agentid')
            .setDescription('Agent Id')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('apikey')
            .setDescription('API Key')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('channelurl')
            .setDescription('Channel Url')
            .setRequired(false));

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const agentId = interaction.options.get('agentid', true).value as string;
        const apiKey = interaction.options.get('apikey', true).value as string | undefined;
        const channelUrl = interaction.options.get('channelurl')?.value as string | undefined;
        if (channelUrl) {
            const url = new URL(channelUrl);
            const pathParts = url.pathname.split('/');
            const channelId = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2];
            await channelConfig.set(interaction.guildId!, channelId, apiKey!, agentId);
        } else {
            await guildConfig.set(interaction.guildId!, apiKey!, agentId);
        }
        await interaction.reply({content: 'Thank you! Now, enable me with /enable on a particular channel and I\'ll get started :).', ephemeral: true});
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }

}
