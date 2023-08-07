import axios from "axios";
import {Message} from "discord.js";

interface ExecutionResponse {
    data: {
        execution_id: string;
        challenge: null | string;
        response: string;
        successful: boolean;
        semver: string;
    }
}

class PromptCMSClient {
    private readonly promptId: string;
    private readonly apiKey: string;
    private readonly baseApiUrl = 'https://www.promptcms.ai/api/v1/partner/ai';

    constructor(promptId?: string, apiKey?: string) {
        this.promptId = promptId || process.env.PROMPT_ID!;
        this.apiKey = apiKey || process.env.PROMPTCMS_API_KEY!;
    }
    public async scoreExecution(execution_id: string, affiliate_id: string, score: number) {
        const apiKey = process.env.PROMPTCMS_API_KEY;
        const apiUrl = `${this.baseApiUrl}/score`;

        const requestData = {
            execution_id: execution_id,
            affiliate: affiliate_id,
            score: score
        };

        try {
            const { data: result } = await axios.post(apiUrl, requestData, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(result);
            return result;
        } catch (error) {
            console.error('Error posting data:', error);
            return null;
        }
    }

    public async execute(fields: object) {
        const apiUrl = `${this.baseApiUrl}/execute?prompt_id=${this.promptId}&fields=${encodeURIComponent(
            JSON.stringify(fields)
        )}`;

        const { data: result } = await axios.get<ExecutionResponse>(apiUrl, {
            headers: {
                Authorization: `Bearer ${this.apiKey}`,
            },
        });
        return result;
    }
}

export default new PromptCMSClient();