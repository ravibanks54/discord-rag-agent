import prisma from "../clients/prisma";

class ChannelConfig {
    public async get(guildId: string, channelId: string) {
        return prisma.channel_config.findUnique(
            {
                where: {
                    guild_id_channel_id: {
                        guild_id: guildId,
                        channel_id: channelId,
                    }
                }
            }
        )
    }

    public async set(guildId: string, channelId: string, apiKey: string, agentId: string) {
        return prisma.channel_config.upsert(
            {
                where: {
                    guild_id_channel_id: {
                        guild_id: guildId,
                        channel_id: channelId,
                    }
                },
                update: {
                    api_key: apiKey,
                    agent_id: agentId,
                },
                create: {
                    guild_id: guildId,
                    channel_id: channelId,
                    api_key: apiKey,
                    agent_id: agentId,
                }
            }
        )
    }

}

export default new ChannelConfig();
