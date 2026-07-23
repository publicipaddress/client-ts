import type { PublicIP } from "../core/common";
import type { HttpClientInterface } from "../core/http";
import { BaseService } from "../core/common";
import type {
    NetworkMeResponse,
    NetworkAutonomousSystemResponse,
    NetworkSecurityReportsResponse,
    NetworkSecurityReportResponse,
} from "./types";

class AutonomousSystemService extends BaseService<NetworkAutonomousSystemResponse> {
    constructor(httpClient: HttpClientInterface) {
        super(httpClient);
    }

    public async getByIp(ip: PublicIP): Promise<NetworkAutonomousSystemResponse> {
        const response = await this.httpClient.request<NetworkAutonomousSystemResponse[] | NetworkAutonomousSystemResponse>(
            this.httpClient.buildQuery("/network/autonomous-systems", { ip, limit: 1 }),
        );

        const asn = Array.isArray(response) ? response[0] : response;

        return {
            number: (asn as NetworkAutonomousSystemResponse | undefined)?.number ?? null,
            organization: (asn as NetworkAutonomousSystemResponse | undefined)?.organization ?? null,
        };
    }
}

class SecurityReportsService extends BaseService<NetworkSecurityReportsResponse> {
    constructor(httpClient: HttpClientInterface) {
        super(httpClient);
    }

    public async getByIp(ip: PublicIP): Promise<NetworkSecurityReportsResponse> {
        return await this.httpClient.request<NetworkSecurityReportsResponse>(
            this.httpClient.buildQuery("/network/security/reports", { ip }),
        );
    }
}

class SecurityRiskService extends BaseService<NetworkSecurityReportResponse> {
    constructor(httpClient: HttpClientInterface) {
        super(httpClient);
    }

    public async getByIp(ip: PublicIP): Promise<NetworkSecurityReportResponse> {
        const encoded = encodeURIComponent(String(ip));
        return await this.httpClient.request<NetworkSecurityReportResponse>(`/network/security/risk/${encoded}`);
    }
}

class MeService extends BaseService<NetworkMeResponse> {
    constructor(httpClient: HttpClientInterface) {
        super(httpClient);
    }

    // no-arg get() implementation for /network/me
    public async get(): Promise<NetworkMeResponse> {
        return await this.httpClient.request<NetworkMeResponse>(
            this.httpClient.buildQuery("/network/me", {}),
        );
    }

    // implement getByIp to satisfy BaseService signature; delegate to get()
    public async getByIp(): Promise<NetworkMeResponse> {
        return await this.get();
    }
}

export class NetworkService {
    public readonly autonomousSystem: AutonomousSystemService;
    public readonly security: {
        reports: SecurityReportsService;
        risk: SecurityRiskService;
    };
    public readonly me: MeService;

    constructor(httpClient: HttpClientInterface) {
        this.autonomousSystem = new AutonomousSystemService(httpClient);
        this.security = {
            reports: new SecurityReportsService(httpClient),
            risk: new SecurityRiskService(httpClient),
        };
        this.me = new MeService(httpClient);

        // provide a bracket-friendly alias for the kebab-case name if consumers prefer it
        // (access via `network['autonomous-system']`). Dot-access with a hyphen is invalid JS.
        (this as any)["autonomous-system"] = this.autonomousSystem;
    }

    // Backwards-compatible top-level method delegating to autonomous system lookup
    public async getByIp(ip: PublicIP): Promise<NetworkAutonomousSystemResponse> {
        return await this.autonomousSystem.getByIp(ip);
    }
}