import promptCMSClient from "../clients/promptcms";
import messageToExecutionId from "../persistence/messageExecutionMapping";
import {Message} from "discord.js";

export default async (message: Message) => {
    if (message.author.bot) return;

    console.log("Answering question...")
    const resultData = await promptCMSClient.execute({question: message.content});
    const reply = await message.reply(resultData.data.response);
    await messageToExecutionId.set(reply.id, resultData.data.execution_id);
}