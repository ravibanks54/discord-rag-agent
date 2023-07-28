import {Client, Intents} from "discord.js";
import axios from "axios";
import "dotenv/config";
import { LRUCache } from 'lru-cache'

const messageToExecutionId = new LRUCache<string, string>({
  max: 500,
});

const client = new Client({
  presence: {
    status: "online",
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.on("ready", () => {
  console.log(`Logged in as: ${client.user?.tag}`);
});

async function scoreExecution(execution_id: string, affiliate_id: string, score: number) {
  const apiKey = process.env.PROMPTCMS_API_KEY;
  const apiUrl = 'https://promptcms.ai/api/v1/partner/ai/score';

  const requestData = {
    execution_id: execution_id,
    affiliate: affiliate_id,
    score: score
  };

  try {
    const { data: result } = await axios.post(apiUrl, requestData, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json', // Set the content type to JSON for a POST request
      },
    });

    console.log(result);
  } catch (error) {
    console.error('Error posting data:', error);
  }
}


client.on('messageReactionAdd', async (reaction, user) => {
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
  const executionId = messageToExecutionId.get(reaction.message.id);
  if (executionId) {
    if (reaction.emoji.name === '👍') {
      // positive
      const reactionAuthor = reaction.message.author!.id;
      await scoreExecution(executionId!, reactionAuthor, 1)
    } else if (reaction.emoji.name === '👎') {
      //negative
      const reactionAuthor = reaction.message.author!.id;
      await scoreExecution(executionId!, reactionAuthor, 0)
    }
  }
});

interface ExecutionResponse {
  data: {
    execution_id: string;
    challenge: null | string;
    response: string;
    successful: boolean;
    semver: string;
  }
}
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const promptId = process.env.PROMPT_ID;
  const apiKey = process.env.PROMPTCMS_API_KEY;
  const warningThreshold = parseInt(
    process.env.PROMPT_WARNING_THRESHOLD || "",
    10
  );
  const apiUrl = `https://promptcms.ai/api/v1/partner/ai/execute?prompt_id=${promptId}&fields=${encodeURIComponent(
    JSON.stringify({ msg: message.content })
  )}`;

  const { data: result } = await axios.get<ExecutionResponse>(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const scoreData = JSON.parse(result.data.response);

  if (scoreData.score > (warningThreshold || 30)) {
    const replyContent = `Automod warn(${scoreData.score}): ${scoreData.reason}`;
    const reply = await message.reply(replyContent);
    messageToExecutionId.set(reply.id, result.data.execution_id);
  }
});

client.login(process.env.DISCORD_TOKEN);
