import axios from "axios";

interface SuperAgentResponse {
    success: boolean;
    data: string;
    trace: {
        output: string;
        steps: {
            action: string;
            input: {
                question: string;
            };
            log: string;
            observation: {
                query: string;
                result: string;
            };
        }[];
    };
}

class SuperAgentClient {
    private readonly agentId: string;
    private readonly apiKey: string;
    private readonly baseApiUrl = 'https://api.superagent.sh/api';

    constructor(agentId?: string, apiKey?: string) {
        this.agentId = agentId || process.env.AGENT_ID!;
        this.apiKey = apiKey || process.env.SUPERAGENT_API_KEY!;
    }

    public async execute(fields: object) {
        const apiKey = this.apiKey;
        const apiUrl = `${this.baseApiUrl}/v1/agents/${this.agentId}/predict`;

        const requestData = {
            input: fields,
        };

        try {
            const {data: result} = await axios.post<SuperAgentResponse>(apiUrl, requestData, {
                headers: {
                    'X_SUPERAGENT_API_KEY': `${apiKey}`,
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
}

export default new SuperAgentClient();
