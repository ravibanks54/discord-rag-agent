import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import guildConfig from '../persistence/guildConfig';
import enabledChannels from '../persistence/enabledChannels';

export const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Gets all info.')

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const config = await guildConfig.get(interaction.guildId!);
        const enabledChannelIds = await enabledChannels.list(interaction.guildId!) || [];
        await interaction.reply({content: `API Key: ${config?.api_key}\nAgent Id: ${config?.agent_id}\nEnabled Channel IDs:\n${enabledChannelIds.map((cid) => cid.id + '\n')}`, ephemeral: true});
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }

}
