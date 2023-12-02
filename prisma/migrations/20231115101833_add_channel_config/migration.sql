-- CreateTable
CREATE TABLE "channel_config" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "guild_id" TEXT NOT NULL,
    "channel_id" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,

    CONSTRAINT "channel_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_guild_channel_config" ON "channel_config"("guild_id", "channel_id");
