export type RequestFunction = <T>(endpoint: string) => Promise<T>;

export type BuildQueryFunction = (
    endpoint: string,
    params: Record<string, string | number | undefined>,
) => string;