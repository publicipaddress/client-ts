import type { PublicIPAddressInfoConfig } from "./types";
import { validateConfig } from "./validation";

export interface HttpClientLike {
    request<T>(endpoint: string): Promise<T>;
    buildQuery(endpoint: string, params: Record<string, string | number | undefined>): string;
}

export class HttpClient implements HttpClientLike {
    private readonly apiKey: string;
    private readonly apiVersion: number;
    private readonly timeout: number;

    constructor(config: PublicIPAddressInfoConfig) {
        validateConfig(config);
        this.apiKey = config.apiKey;
        this.apiVersion = config.apiVersion;
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
                let responseBody: unknown = null;
                try {
                    responseBody = await response.json();
                } catch {
                    // Response body is not JSON
                }
                const message = this.extractErrorMessage(responseBody, response.status);
                throw new Error(message);
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

    private extractErrorMessage(responseBody: unknown, statusCode: number): string {
        if (typeof responseBody === 'string' && responseBody.trim()) {
            return responseBody;
        }

        if (typeof responseBody === 'object' && responseBody !== null) {
            const body = responseBody as Record<string, unknown>;
            
            if (typeof body.error === 'string' && body.error.trim()) {
                return body.error;
            }
            if (typeof body.message === 'string' && body.message.trim()) {
                return body.message;
            }
            if (typeof body.detail === 'string' && body.detail.trim()) {
                return body.detail;
            }
            if (typeof body.description === 'string' && body.description.trim()) {
                return body.description;
            }

            if (typeof body.error === 'object' && body.error !== null) {
                const errorObj = body.error as Record<string, unknown>;
                if (typeof errorObj.message === 'string' && errorObj.message.trim()) {
                    return errorObj.message;
                }
            }
        }

        return String(statusCode);
    }

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
