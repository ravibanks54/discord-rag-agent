import messageToExecutionId from "../persistence/messageExecutionMapping";
import promptCmsClient from "../clients/promptcms";
import {MessageReaction, PartialMessageReaction, PartialUser, User} from "discord.js";

export default async (reaction: MessageReaction | PartialMessageReaction, user: User | PartialUser) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message:', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    const messageExecution = await messageToExecutionId.get(reaction.message.id);
    if (messageExecution) {
        if (reaction.emoji.name === '👍') {
            // positive
            const reactionAuthor = reaction.message.author!.id;
            await promptCmsClient.scoreExecution(messageExecution.prompt_execution_id, reactionAuthor, 1);
        } else if (reaction.emoji.name === '👎') {
            // negative
            const reactionAuthor = reaction.message.author!.id;
            await promptCmsClient.scoreExecution(messageExecution.prompt_execution_id, reactionAuthor, 0);
        }
    }
};
