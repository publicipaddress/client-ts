import { isPublicIP, type PublicIP } from "../../core/common";

export function validateWeatherRequest(ip: string): asserts ip is PublicIP {
    if (!isPublicIP(ip)) {
        throw new Error("Weather request ip must be a valid public IP address");
    }
}