import type { BuildQueryFunction, RequestFunction } from "../types";
import type { WeatherRequest, WeatherResponse } from "./types";

export async function getWeather(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: WeatherRequest,
): Promise<WeatherResponse> {
    const response = await request<WeatherResponse>(buildQuery("/weather/current", { ip: input.ip }));

    return {
        latitude: response.latitude ?? null,
        longitude: response.longitude ?? null,
        weather: response.weather ?? null,
    };
}