import type { BuildQueryFunction, RequestFunction } from "../types";
import type { WeatherRequest, WeatherCurrentResponse } from "./types";

export async function getWeather(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: WeatherRequest,
): Promise<WeatherCurrentResponse> {
    const response = await request<WeatherCurrentResponse>(buildQuery("/weather/current", { ip: input.ip }));

    return {
        success: response.success ?? null,
        ip: response.ip ?? null,
        latitude: response.latitude ?? null,
        longitude: response.longitude ?? null,
        weather: response.weather ?? null,
    };
}