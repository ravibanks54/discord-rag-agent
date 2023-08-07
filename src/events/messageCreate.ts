import promptCMSClient from "../clients/promptcms";
import messageToExecutionId from "../persistence/messageExecutionMapping";
import {Message} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";

export default async (message: Message) => {
    if (message.author.bot) return;
    if (await enabledChannels.is_enabled(message.guildId!, message.channelId!)) {
        console.log("Answering question...")
        const resultData = await promptCMSClient.execute({question: message.content});
        const reply = await message.reply(resultData.data.response);
        await messageToExecutionId.set(reply.id, resultData.data.execution_id);
    }

}