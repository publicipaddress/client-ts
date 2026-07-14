import type { BuildQueryFunction, RequestFunction } from "../types";
import type {
    NetworkRequest,
    NetworkMeResponse,
} from "./types";

export async function getNetwork(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: NetworkRequest,
): Promise<NetworkMeResponse> {
    const network = await request<NetworkMeResponse>(buildQuery("/network/me", {}));

    return {
        ip: network.ip ?? null,
        version: network.version ?? null,
    };
}