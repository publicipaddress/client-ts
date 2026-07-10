export interface WeatherResponse {
    latitude: number | null;
    longitude: number | null;
    weather: Record<string, unknown> | null;
}