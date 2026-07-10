export interface NetworkResponse {
    ip: string | null;
    as_number: string | null;
    organization: string | null;
    version: string | null;
}

export interface NetworkAutonomousSystemResponse {
    number?: string;
    organization?: string;
}