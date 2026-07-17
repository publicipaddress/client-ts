import type { IP } from "../types";
import type { HttpClientLike } from "../httpClient";
import { GetByIpService } from "../getByIp";
import type { WeatherCurrentResponse } from "./types";

export class WeatherService extends GetByIpService<WeatherCurrentResponse> {
    constructor(httpClient: HttpClientLike) {
        super(httpClient);
    }

    protected async lookupByIp(ip: IP): Promise<WeatherCurrentResponse> {
        const response = await this.httpClient.request<WeatherCurrentResponse>(
            this.httpClient.buildQuery("/weather/current", { ip }),
        );

        return {
            success: response.success ?? null,
            ip: response.ip ?? null,
            latitude: response.latitude ?? null,
            longitude: response.longitude ?? null,
            weather: response.weather ?? null,
        };
    }
}