import type {
  PublicIPAddressInfoConfig,
  Geolocation,
  NetworkInfo,
  WeatherInfo,
  CountryLookup,
  CityLookup,
  AutonomousSystemLookup,
} from "./types";

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

  async getGeolocation(ip: string): Promise<Geolocation> {
    const [countries, cities] = await Promise.all([
      this.request<CountryLookup[]>(this.buildQuery("/geolocation/countries", { ip, limit: 1 })),
      this.request<CityLookup[]>(this.buildQuery("/geolocation/cities", { ip, limit: 1 })),
    ]);

    const country = countries[0];
    const city = cities[0];

    return {
      city: city?.name,
      region: country?.region ?? city?.state_code,
      country: country?.name,
      country_code: country?.iso2 ?? city?.country_code,
      latitude: city?.latitude ?? country?.latitude,
      longitude: city?.longitude ?? country?.longitude,
      timezone: country?.timezones?.[0]?.zoneName,
    };
  }

  async getNetwork(ip: string): Promise<NetworkInfo> {
    const autonomousSystems = await this.request<AutonomousSystemLookup[]>(
      this.buildQuery("/network/autonomous-systems", { ip, limit: 1 }),
    );
    const autonomousSystem = autonomousSystems[0];

    return {
      ip,
      as_number: autonomousSystem?.number,
      organization: autonomousSystem?.organization,
    };
  }

  async getWeather(ip: string): Promise<WeatherInfo> {
    return this.request<WeatherInfo>(this.buildQuery("/weather/current", { ip }));
  }
}
