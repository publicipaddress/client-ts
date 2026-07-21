export interface HttpClientInterface {
    request<T>(endpoint: string): Promise<T>;
    buildQuery(endpoint: string, params: Record<string, string | number | undefined>): string;
}
