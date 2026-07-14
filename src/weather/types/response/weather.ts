export interface WeatherCurrentResponse {
    success: boolean | null;
    ip: string | null;
    latitude: number | null;
    longitude: number | null;
    weather: Record<string, unknown> | null;
}

export interface WeatherForecastResponse {
    success: boolean | null;
    ip: string | null;
    latitude: number | null;
    longitude: number | null;
    forecast: Record<string, unknown> | null;
}