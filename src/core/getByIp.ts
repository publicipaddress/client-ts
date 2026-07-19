import type { PublicIP } from "./types";
import type { HttpClientLike } from "./httpClient";

export abstract class GetByIpService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientLike) { }

    protected abstract getByIp(ip: PublicIP): Promise<TResponse>;
}