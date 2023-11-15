import prisma from "../clients/prisma";

class EnabledChannels {
    public async is_enabled(guildId: string, channelId: string) {
        const enabledChannels = await prisma.enabled_channels.findUnique({
            where: {
                guild_id_channel_id: {
                    guild_id: guildId,
                    channel_id: channelId,
                }
            }
        });
        return Boolean(enabledChannels);
    }

    public async enable(guildId: string, channelId: string) {
        return prisma.enabled_channels.upsert({
            where: {
                guild_id_channel_id: {
                    guild_id: guildId,
                    channel_id: channelId,
                },
            },
            create: {
                guild_id: guildId,
                channel_id: channelId,
            },
            update: {},
        });
    }


    public async disable(guildId: string, channelId: string) {
        return prisma.enabled_channels.delete({
            where: {
                guild_id_channel_id: {
                    guild_id: guildId,
                    channel_id: channelId,
                },
            },
        });
    }

    public async list(guildId: string) {
        return prisma.enabled_channels.findMany({
            where: {
                guild_id: guildId,
            }
        })
    }
}

export default new EnabledChannels();
