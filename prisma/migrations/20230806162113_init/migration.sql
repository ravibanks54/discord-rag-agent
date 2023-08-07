-- CreateTable
CREATE TABLE "enabled_channels" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Enabled Channels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "enabled_channels_unique_guild_channel" ON "enabled_channels"("guild_id", "channel_id");
