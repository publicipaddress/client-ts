import type { PublicIP } from "../../../core/common";

export interface NetworkMeResponse {
    ip: PublicIP | null;
    version: number | null;
}

export interface NetworkAutonomousSystemResponse {
    number: string | null;
    organization: string | null;
}

export interface NetworkSecurityReportIndicatorResponse {
    [key: string]: unknown;
}

export interface NetworkSecurityReportsResponse {
    success: boolean | null;
    total_indicators: number | null;
    indicators: NetworkSecurityReportIndicatorResponse[];
}

export interface NetworkSecurityReportResponse {
    success: boolean | null;
    ip: PublicIP | null;
    total_indicators: number | null;
    indicators: NetworkSecurityReportIndicatorResponse[];
}