export interface CountryLookup {
    name?: string;
    iso2?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    timezones?: Array<{
        zoneName?: string;
    }>;
}

export interface CityLookup {
    name?: string;
    country_code?: string;
    state_code?: string;
    latitude?: number;
    longitude?: number;
}

export interface AutonomousSystemLookup {
    number?: string;
    organization?: string;
}