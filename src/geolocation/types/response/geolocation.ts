export interface GeolocationResponse {
    city?: string;
    region?: string;
    country?: string;
    country_code?: string;
    latitude?: number;
    longitude?: number;
    timezone?: string;
    zip_code?: string;
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