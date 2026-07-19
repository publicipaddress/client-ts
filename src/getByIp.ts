import type { PublicIP } from "./types";
import type { HttpClientLike } from "./httpClient";

export abstract class GetByIpService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientLike) { }

    public getByIp(ip: PublicIP): Promise<TResponse> {
        return this.lookupByIp(ip);
    }

    protected abstract lookupByIp(ip: PublicIP): Promise<TResponse>;
}