import type { BuildQueryFunction, RequestFunction } from "../types";
import type { WeatherRequest, WeatherResponse } from "./types";

export async function getWeather(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: WeatherRequest,
): Promise<WeatherResponse> {
    return request<WeatherResponse>(buildQuery("/weather/current", { ip: input.ip }));
}