import type {
  PublicIPAddressInfoConfig,
} from "./types";
import { getGeolocation } from "./geolocation";
import { getNetwork } from "./network";
import { getWeather } from "./weather";

export class PublicIPAddressInfo {
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

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers: HeadersInit = {};
    if (this.apiKey) {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }

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
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`API request timed out after ${this.timeout}ms`);
      }

      throw error;
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    }
  }

  private buildQuery(endpoint: string, params: Record<string, string | number | undefined>): string {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        searchParams.set(key, String(value));
      }
    }

    const query = searchParams.toString();
    return query.length > 0 ? `${endpoint}?${query}` : endpoint;
  }

  async getGeolocation(ip: string) {
    return getGeolocation(this.request.bind(this), this.buildQuery.bind(this), { ip });
  }

  async getNetwork(ip: string) {
    return getNetwork(this.request.bind(this), this.buildQuery.bind(this), { ip });
  }

  async getWeather(ip: string) {
    return getWeather(this.request.bind(this), this.buildQuery.bind(this), { ip });
  }
}
