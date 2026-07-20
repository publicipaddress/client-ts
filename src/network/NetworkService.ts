import type { PublicIP } from "../core/common";
import type { HttpClientLike } from "../core/http";
import { BaseService } from "../core/common";
import type {
    NetworkAutonomousSystemResponse,
} from "./types";

export class NetworkService extends BaseService<NetworkAutonomousSystemResponse> {
    constructor(httpClient: HttpClientLike) {
        super(httpClient);
    }

    public async getByIp(ip: PublicIP): Promise<NetworkAutonomousSystemResponse> {
        const response = await this.httpClient.request<NetworkAutonomousSystemResponse>(
            this.httpClient.buildQuery(`/ips/${ip}/autonomous-system`, {}),
        );

        return {
            number: response.number ?? null,
            organization: response.organization ?? null,
        };
    }
}