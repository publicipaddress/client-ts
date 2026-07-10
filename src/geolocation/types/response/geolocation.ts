export interface GeolocationResponse {
    city: string | null;
    region: string | null;
    country: string | null;
    country_code: string | null;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
    zip_code?: string | null;
}

export interface GeolocationCountryResponse {
    name?: string;
    iso2?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    timezones?: Array<{
        zoneName?: string;
    }>;
}

export interface GeolocationCityResponse {
    name?: string;
    country_code?: string;
    state_code?: string;
    latitude?: number;
    longitude?: number;
}