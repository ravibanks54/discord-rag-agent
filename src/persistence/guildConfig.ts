import prisma from "../clients/prisma";

class GuildConfig {
    public async get(guildId: string) {
        return prisma.guild_config.findUnique(
            {
                where: {
                    guild_id: guildId,
                }
            }
        )
    }

    public async set(guildId: string, apiKey: string, agentId: string) {
        return prisma.guild_config.create(
            {
                data: {
                    guild_id: guildId,
                    api_key: apiKey,
                    agent_id: agentId,
                }
            }
        )
    }

}

export default new GuildConfig();
