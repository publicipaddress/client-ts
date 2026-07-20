import type { PublicIP } from "./types/Common";
import type { HttpClientLike } from "../http/HttpClient";

export abstract class BaseService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientLike) { }

    protected abstract getByIp(ip: PublicIP): Promise<TResponse>;
}
