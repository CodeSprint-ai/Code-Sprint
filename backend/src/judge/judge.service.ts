import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class Judge0Service {
    private readonly logger = new Logger(Judge0Service.name);
    private client: AxiosInstance;
    private languageCache: Record<string, number> = {};

    constructor() {
        const baseURL =
            process.env.JUDGE0_BASE_URL || 'https://judge0-ce.p.rapidapi.com';

        const isRapidApi = baseURL.includes('rapidapi');

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        if (isRapidApi) {
            headers['x-rapidapi-host'] = 'judge0-ce.p.rapidapi.com';
            headers['x-rapidapi-key'] = process.env.JUDGE0_RAPID_API_KEY!;
        } else if (process.env.JUDGE0_API_KEY) {
            headers['X-Auth-Token'] = process.env.JUDGE0_API_KEY;
        }

        this.client = axios.create({
            baseURL,
            headers,
            timeout: 30000,
        });

        this.logger.log(`Judge0Service initialized for: ${baseURL}`);
    }

    async getLanguages(): Promise<Array<{ id: number; name: string }>> {
        const resp = await this.client.get('/languages');
        return resp.data;
    }

    async getLanguageIdByNameHint(hint: string) {
        hint = hint.toLowerCase();
        if (this.languageCache[hint]) return this.languageCache[hint];

        const langs = await this.getLanguages();
        const found = langs.find((l) => l.name.toLowerCase().includes(hint));
        if (!found) throw new Error(`Language not found for hint: ${hint}`);

        this.languageCache[hint] = found.id;
        return found.id;
    }

    /**
     * Submit multiple test cases as a batch
     */
    async submitBatch(
        items: Array<{
            language_id: number;
            source_code: string;
            stdin?: string;
            expected_output?: string;
            cpu_time_limit?: number;
            memory_limit?: number;
        }>,
    ) {
        const base64 = process.env.JUDGE0_BASE64 === 'true' ? 'true' : 'false';

        // If using RapidAPI → must send one by one
        const isRapidApi = (process.env.JUDGE0_BASE_URL || '').includes('rapidapi');

        try {
            if (isRapidApi) {
                const tokens: { token?: string }[] = [];

                for (const item of items) {
                    const resp = await this.client.post(
                        `/submissions?base64_encoded=true&wait=false&fields=*`,
                        item,
                    );

                    if (!resp.data?.token) {
                        this.logger.error('⚠️ Invalid RapidAPI response:', resp.data);
                        continue;
                    }

                    tokens.push({ token: resp.data.token });
                }

                return tokens;
            } else {
                // ✅ For self-hosted Judge0
                const resp = await this.client.post(
                    `/submissions/batch?base64_encoded=true&wait=false&fields=*`,
                    { submissions: items },
                );

                if (!resp.data?.submissions) {
                    this.logger.error('Invalid response from Judge0:', resp.data);
                    throw new Error('Invalid Judge0 batch submission response');
                }

                return resp.data.submissions;
            }
        } catch (err: any) {
            this.logger.error('❌ Error in submitBatch:', err.message);
            if (err.response?.data) this.logger.error('Judge0 error response:', err.response.data);
            throw err;
        }
    }

    async getSubmissionBatch(tokens: string[]) {
        if (!tokens?.length) return [];
        const tokenStr = tokens.join(',');

        const resp = await this.client.get('/submissions/batch', {
            params: {
                tokens: tokenStr,
                base64_encoded: 'true',
            },
        });

        return resp.data?.submissions ?? [];
    }

    async pollBatchUntilDone(
        tokens: string[],
        timeoutMs = 30000,
        intervalMs = 700,
    ) {
        if (!tokens?.length) return [];

        const start = Date.now();
        while (Date.now() - start < timeoutMs) {
            const results = await this.getSubmissionBatch(tokens);

            if (!results?.length) {
                this.logger.warn('Empty Judge0 results, retrying...');
                await new Promise((r) => setTimeout(r, intervalMs));
                continue;
            }

            const allDone = results.every((r) => {
                const sid = r?.status?.id ?? r?.status_id;
                return sid && sid >= 3;
            });

            if (allDone) {
                this.logger.log('✅ All Judge0 submissions finished.');
                return results;
            }

            await new Promise((r) => setTimeout(r, intervalMs));
        }

        this.logger.warn('⏰ Judge0 polling timed out, returning partial results.');
        return await this.getSubmissionBatch(tokens);
    }
}
