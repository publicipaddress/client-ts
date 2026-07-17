import type { IP } from "./types";
import type { HttpClientLike } from "./httpClient";

export abstract class GetByIpService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientLike) { }

    public getByIp(ip: IP): Promise<TResponse> {
        return this.lookupByIp(ip);
    }

    protected abstract lookupByIp(ip: IP): Promise<TResponse>;
}