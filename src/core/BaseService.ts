import type { PublicIP } from "./types";
import type { HttpClientLike } from "./HttpClient";

export abstract class BaseService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientLike) { }

    protected abstract getByIp(ip: PublicIP): Promise<TResponse>;
}