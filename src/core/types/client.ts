export interface PublicIPAddressInfoConfig {
  apiKey: string;
  apiVersion: number;
  timeout?: number;
}

export type RequestFunction = (endpoint: string) => Promise<unknown>;
export type BuildQueryFunction = (endpoint: string, params: Record<string, string | number | undefined>) => string;