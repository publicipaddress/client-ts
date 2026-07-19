import type { PublicIP } from "../core/types";
import type { HttpClientLike } from "../core/httpClient";
import { GetByIpService } from "../core/getByIp";
import type {
    NetworkAutonomousSystemResponse,
} from "./types";

export class NetworkService extends GetByIpService<NetworkAutonomousSystemResponse> {
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