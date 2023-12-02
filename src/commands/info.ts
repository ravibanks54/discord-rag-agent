import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import guildConfig from '../persistence/guildConfig';
import enabledChannels from '../persistence/enabledChannels';
import channelConfig from "../persistence/channelConfig";

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gets all info.')

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const [gConfig, cConfig] = await Promise.all([
            guildConfig.get(interaction.guildId!),
            channelConfig.get(interaction.guildId!, interaction.channelId!)
        ]);
        const config = {...gConfig, ...cConfig}
        const enabledChannelIds = await enabledChannels.list(interaction.guildId!) || [];
        console.log(`API Key: ${config?.api_key}\nAgent Id: ${config?.agent_id}\nEnabled Channel IDs:\n${enabledChannelIds.map((chan) => chan.channel_id).join('\n')}`);
        await interaction.reply({content: `API Key: ${config?.api_key}\nAgent Id: ${config?.agent_id}\nEnabled Channel IDs:\n${enabledChannelIds.map((chan) => chan.channel_id).join('\n')}`, ephemeral: true});
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }

}
