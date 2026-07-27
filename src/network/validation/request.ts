import { isPublicIP, type PublicIP } from "../../core/common";

export function validateNetworkRequest(ip: string): asserts ip is PublicIP {
    if (!isPublicIP(ip)) {
        throw new Error("Network request ip must be a valid public IP address");
    }
}