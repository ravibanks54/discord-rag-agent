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
        return prisma.guild_config.upsert(
            {
                where: { guild_id: guildId },
                update: { api_key: apiKey, agent_id: agentId },
                create: { guild_id: guildId, api_key: apiKey, agent_id: agentId },
            }
        )
    }

}

export default new GuildConfig();
