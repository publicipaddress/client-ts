import type { PublicIP } from "../../../core/common";

export interface WeatherCurrentResponse {
    success: boolean | null;
    ip: PublicIP | null;
    latitude: number | null;
    longitude: number | null;
    weather: Record<string, unknown> | null;
}

export interface WeatherForecastResponse {
    success: boolean | null;
    ip: PublicIP | null;
    latitude: number | null;
    longitude: number | null;
    forecast: Record<string, unknown> | null;
}