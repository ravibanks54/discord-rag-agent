import promptCMSClient from "../clients/promptcms";
import messageToExecutionId from "../persistence/messageExecutionMapping";
import {Message} from "discord.js";
import enabledChannels from "../persistence/enabledChannels";
import superagentClient from "../clients/superagent";

export default async (message: Message) => {
    if (message.author.bot) return;
    if (await enabledChannels.is_enabled(message.guildId!, message.channelId!)) {
        if (message.content.includes("?")) {
            console.log("Answering question...")
            // const resultData = await promptCMSClient.execute({question: message.content});
            const result = await superagentClient.execute({input: message.content});
            if (result) {
                await message.reply(`${result.data}`);
            } else {
                await message.reply({content: 'Sorry, there seems to be a problem. Please try again later.'});
            }
            // await messageToExecutionId.set(reply.id, resultData.data.execution_id)
        } else {
            console.log("No question mark found. Skipping question.")
        }
    }

}
