import type { PublicIP } from "./types/Common";
import type { HttpClientInterface } from "../http/types";

export abstract class BaseService<TResponse> {
    protected constructor(protected readonly httpClient: HttpClientInterface) { }

    protected abstract getByIp(ip: PublicIP): Promise<TResponse>;

    // optional
    protected  get(): Promise<TResponse> {
        throw new Error("Method not implemented.");
    }
}
