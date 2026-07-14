export interface NetworkMeResponse {
    ip: string | null;
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
    ip: string | null;
    total_indicators: number | null;
    indicators: NetworkSecurityReportIndicatorResponse[];
}