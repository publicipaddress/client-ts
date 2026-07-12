export interface GeolocationLocationResponse {
    city: string | null;
    region: string | null;
    country: string | null;
    country_code: string | null;
    latitude: number | null;
    longitude: number | null;
    timezone: string | null;
    zip_code: string | null;
}

export interface GeolocationRegionResponse {
    id: number | null;
    name: string | null;
}

export interface GeolocationSubregionResponse {
    id: number | null;
    name: string | null;
    region_id: number | null;
}

export interface GeolocationTimezoneResponse {
    zoneName: string | null;
    gmtOffset: number | null;
    gmtOffsetName: string | null;
    abbreviation: string | null;
    tzName: string | null;
}

export interface GeolocationCountryResponse {
    id: number | null;
    name: string | null;
    iso3: string | null;
    iso2: string | null;
    numeric_code: string | null;
    phonecode: string | null;
    capital: string | null;
    currency: string | null;
    currency_name: string | null;
    currency_symbol: string | null;
    tld: string | null;
    native: string | null;
    population: number | null;
    gdp: number | null;
    region: string | null;
    region_id: number | null;
    subregion: string | null;
    subregion_id: number | null;
    nationality: string | null;
    timezones: GeolocationTimezoneResponse[];
    translations: Record<string, string | null> | null;
    latitude: number | null;
    longitude: number | null;
    emoji: string | null;
    emojiU: string | null;
}

export interface GeolocationStateResponse {
    id: number | null;
    name: string | null;
    iso2: string | null;
    iso3166_2: string | null;
    native: string | null;
    type: string | null;
    timezone: string | null;
    latitude: number | null;
    longitude: number | null;
    location: Record<string, unknown> | null;
    country_id: number | null;
    country_code: string | null;
}

export interface GeolocationCityResponse {
    id: number | null;
    name: string | null;
    state_id: number | null;
    state_code: string | null;
    country_id: number | null;
    country_code: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface GeolocationCurrencyResponse {
    name: string | null;
    symbol: string | null;
    code: string | null;
}