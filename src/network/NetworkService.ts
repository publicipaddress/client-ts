import type { PublicIP } from "../types";
import type { HttpClientLike } from "../httpClient";
import { GetByIpService } from "../getByIp";
import type {
    NetworkAutonomousSystemResponse,
} from "./types";

export class NetworkService extends GetByIpService<NetworkAutonomousSystemResponse> {
    constructor(httpClient: HttpClientLike) {
        super(httpClient);
    }

    protected async lookupByIp(ip: PublicIP): Promise<NetworkAutonomousSystemResponse> {
        const response = await this.httpClient.request<NetworkAutonomousSystemResponse>(
            this.httpClient.buildQuery(`/ips/${ip}/autonomous-system`, {}),
        );

        return {
            number: response.number ?? null,
            organization: response.organization ?? null,
        };
    }
}