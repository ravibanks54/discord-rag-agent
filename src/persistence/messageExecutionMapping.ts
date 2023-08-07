import prisma from "../clients/prisma";

class MessageExecutionMapping {
    public async get(messageId: string) {
        return prisma.message_prompt_execution.findUnique(
            {
                where: {
                    message_id: messageId,
                }
            }
        )
    }

    public async set(messageId: string, executionId: string) {
        return prisma.message_prompt_execution.create(
            {
                data: {
                    message_id: messageId,
                    prompt_execution_id: executionId,
                }
            }
        )
    }

}

export default new MessageExecutionMapping();
