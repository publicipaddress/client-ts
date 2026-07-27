import { isPublicIP, type PublicIP } from "../../core/common";

export function validateGeolocationRequest(ip: string): asserts ip is PublicIP {
    if (!isPublicIP(ip)) {
        throw new Error("Geolocation request ip must be a valid public IP address");
    }
}