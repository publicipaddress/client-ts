interface ClientConfig {
  apiKey?: string;
  apiVersion?: number;
}

class PublicIPAddressInfo {
  private apiKey?: string;
  private apiVersion: number = 1;

  configure(config: ClientConfig): void {
    if (config.apiKey) this.apiKey = config.apiKey;
    if (config.apiVersion) this.apiVersion = config.apiVersion;
  }

  private getBaseUrl(): string {
    return `https://publicipaddress.info/api/v${this.apiVersion}`;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    const headers: HeadersInit = {};
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }
    return response.json();
  }

  async getGeolocation(ip: string) {
    return this.request<any>(`/geolocation/ips/${ip}`);
  }

  async getNetwork(ip: string) {
    return this.request<any>(`/network/ips/${ip}`);
  }

  async getWeather(ip: string) {
    return this.request<any>(`/weather/ips/${ip}`);
  }
}

export const client = new PublicIPAddressInfo();
