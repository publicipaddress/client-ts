export interface WeatherResponse {
    latitude?: number;
    longitude?: number;
    weather?: Record<string, unknown>;
}