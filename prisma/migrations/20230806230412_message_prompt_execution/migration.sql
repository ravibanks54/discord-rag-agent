-- AlterTable
ALTER TABLE "enabled_channels" RENAME CONSTRAINT "Enabled Channels_pkey" TO "enabled_channels_pkey";

-- CreateTable
CREATE TABLE "message_prompt_execution" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "message_id" TEXT NOT NULL,
    "prompt_execution_id" TEXT NOT NULL,

    CONSTRAINT "message_prompt_execution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "message_prompt_execution_unique_message_prompt_execution" ON "message_prompt_execution"("message_id", "prompt_execution_id");
