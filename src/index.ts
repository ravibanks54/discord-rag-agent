import { Client, Intents } from "discord.js";
import axios from "axios";
import "dotenv/config";

const client = new Client({
  presence: {
    status: "online",
  },
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as: ${client.user?.tag}`);
});

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

  const { data: result } = await axios.get(apiUrl, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const scoreData = JSON.parse(result.data.response);
  const reply = `Automod warn(${scoreData.score}): ${scoreData.reason}`;
  if (scoreData.score > warningThreshold || 30) {
    message.reply(reply);
  }
});

client.login(process.env.DISCORD_TOKEN);
