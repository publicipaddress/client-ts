import type { IP } from "../../../types";

export interface GeolocationRequest {
    ip: IP;
}

export type GeolocationRegionRequest = GeolocationRequest;
export type GeolocationSubregionRequest = GeolocationRequest;
export type GeolocationCountryRequest = GeolocationRequest;
export type GeolocationStateRequest = GeolocationRequest;
export type GeolocationCityRequest = GeolocationRequest;
export type GeolocationCurrencyRequest = GeolocationRequest;
export type GeolocationTimezoneRequest = GeolocationRequest;