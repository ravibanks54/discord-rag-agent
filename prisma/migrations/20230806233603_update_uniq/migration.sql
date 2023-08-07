/*
  Warnings:

  - A unique constraint covering the columns `[message_id]` on the table `message_prompt_execution` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "message_prompt_execution_unique_message_prompt_execution";

-- CreateIndex
CREATE UNIQUE INDEX "message_prompt_execution_unique_message" ON "message_prompt_execution"("message_id");
