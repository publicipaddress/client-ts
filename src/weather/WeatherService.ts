import type { PublicIP } from "../core/types";
import type { HttpClientLike } from "../core/http";
import { BaseService } from "../core/common";
import type { WeatherCurrentResponse } from "./types";

export class WeatherService extends BaseService<WeatherCurrentResponse> {
    constructor(httpClient: HttpClientLike) {
        super(httpClient);
    }

    public async getByIp(ip: PublicIP): Promise<WeatherCurrentResponse> {
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