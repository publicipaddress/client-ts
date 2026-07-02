import type { IPClientConfig, Geolocation, NetworkInfo, WeatherInfo } from "./types";

export class IPClient {
  private readonly apiKey: string;
  private readonly apiVersion: number;
  private readonly timeout: number;

  constructor(config: IPClientConfig) {
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

  async getGeolocation(ip: string): Promise<Geolocation> {
    return this.request<Geolocation>(`/geolocation/ips/${ip}`);
  }

  async getNetwork(ip: string): Promise<NetworkInfo> {
    return this.request<NetworkInfo>(`/network/ips/${ip}`);
  }

  async getWeather(ip: string): Promise<WeatherInfo> {
    return this.request<WeatherInfo>(`/weather/ips/${ip}`);
  }
}
