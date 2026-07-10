import type { BuildQueryFunction, RequestFunction } from "../types";
import type {
    NetworkRequest,
    NetworkResponse,
    NetworkAutonomousSystemResponse,
} from "./types";

export async function getNetwork(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: NetworkRequest,
): Promise<NetworkResponse> {
    const autonomousSystems = await request<NetworkAutonomousSystemResponse[]>(
        buildQuery("/network/autonomous-systems", { ip: input.ip, limit: 1 }),
    );
    const autonomousSystem = autonomousSystems[0];

    return {
        ip: input.ip ?? null,
        as_number: autonomousSystem?.number ?? null,
        organization: autonomousSystem?.organization ?? null,
        version: null,
    };
}