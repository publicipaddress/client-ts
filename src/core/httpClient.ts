import type { PublicIPAddressInfoConfig } from "./types";

export interface HttpClientLike {
    request<T>(endpoint: string): Promise<T>;
    buildQuery(endpoint: string, params: Record<string, string | number | undefined>): string;
}

export class HttpClient implements HttpClientLike {
    private readonly apiKey: string;
    private readonly apiVersion: number;
    private readonly timeout: number;

    constructor(config: PublicIPAddressInfoConfig) {
        this.apiKey = config.apiKey;
        this.apiVersion = config.apiVersion ?? 1;
        this.timeout = config.timeout ?? 10000;
    }

    private getBaseUrl(): string {
        return `https://publicipaddress.info/api/v${this.apiVersion}`;
    }

    public readonly request = async <T>(endpoint: string): Promise<T> => {
        const url = `${this.getBaseUrl()}${endpoint}`;
        const headers: HeadersInit = this.apiKey
            ? { Authorization: `Bearer ${this.apiKey}` }
            : {};

        const controller = new AbortController();
        const timeoutId =
            this.timeout > 0
                ? globalThis.setTimeout(() => controller.abort(), this.timeout)
                : undefined;

        try {
            const response = await fetch(url, {
                headers,
                signal: controller.signal,
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            return (await response.json()) as T;
        } catch (error) {
            if (error instanceof Error && error.name === "AbortError") {
                throw new Error(`API request timed out after ${this.timeout}ms`);
            }

            throw error;
        } finally {
            if (timeoutId !== undefined) {
                clearTimeout(timeoutId);
            }
        }
    };

    public readonly buildQuery = (
        endpoint: string,
        params: Record<string, string | number | undefined>,
    ): string => {
        const searchParams = new URLSearchParams();

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined) {
                searchParams.set(key, String(value));
            }
        }

        const query = searchParams.toString();
        return query.length > 0 ? `${endpoint}?${query}` : endpoint;
    };
}