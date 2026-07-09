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