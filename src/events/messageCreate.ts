import promptCMSClient from "../clients/promptcms";
import {Message} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";
import discordClient from "../index";
import guildConfig from "../persistence/guildConfig";
import channelConfig from "../persistence/channelConfig";

export default async (message: Message) => {
    console.log("Handling messageCreate event for message ID: ", message.id)
    if (message.author.bot) return;
    if (await enabledChannels.is_enabled(message.guildId!, message.channel.isThread() ? message.channel.parentId! : message.channelId!)) {
        const [gConfig, cConfig] = await Promise.all([
            guildConfig.get(message.guildId!),
            channelConfig.get(message.guildId!, message.channelId!)
        ]);
        const config = {...gConfig, ...cConfig};
        // If no config, or missing API Key/Agent ID, do nothing.
        if (!config || (!config.api_key || !config.agent_id)) {
            console.log("Not configured.");
            await message.reply({content: 'Sorry, I need to be configured before I respond to any questions.'});
            return;
        }
        if (message.content.includes("?") || message.mentions.has(discordClient.user!.id) || message.channel.isThread()) {
            console.log("Answering question...");
            const result = await promptCMSClient.invokeAgent(message.content, config.agent_id, config.api_key, message.channel.isThread() ? message.channel.id : undefined);
            if (result) {
                await message.reply(`${result.data.output}`);
            } else {
                await message.reply({content: 'Sorry, there seems to be a problem. Please try again later.'});
            }
            // await messageToExecutionId.set(reply.id, resultData.data.execution_id)
        } else {
            console.log("No question mark found. Skipping question.")
        }
    }

}
