import { SlashCommandBuilder } from '@discordjs/builders';
import {BaseCommandInteraction, GuildMemberRoleManager} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";
import guildConfig from '../persistence/guildConfig';

export const data = new SlashCommandBuilder()
    .setName('enable')
    .setDescription('Enables bot for this channel.');

export async function execute(interaction: BaseCommandInteraction) {
    const memberRoles = interaction.member!.roles as GuildMemberRoleManager;
    if (memberRoles.cache.some((role: { name: string; }) => role.name === 'Admin')) {
        const guildConfigExists = Boolean(await guildConfig.get(interaction.guildId!));
        if (!guildConfigExists) {
            await interaction.reply({content: 'Please configure me first using the /configure command.', ephemeral: true});
        }
        console.log(`Enabling for channel ${interaction.channelId}.`)
        if (await enabledChannels.is_enabled(interaction.guildId!, interaction.channelId)) {
            await interaction.reply({content: 'I am already enabled for this channel.', ephemeral: true});
        } else {
            await enabledChannels.enable(interaction.guildId!, interaction.channelId);
            await interaction.reply({content: 'Enabled!', ephemeral: true});
        }
    } else {
        await interaction.reply({content: 'Only users with the role Admin are allowed to configure me.', ephemeral: true});
    }

}
