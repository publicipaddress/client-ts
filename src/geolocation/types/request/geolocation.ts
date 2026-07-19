import type { PublicIP } from "../../../types";

export interface GeolocationRequest {
    ip: PublicIP;
}

export type GeolocationRegionRequest = GeolocationRequest;
export type GeolocationSubregionRequest = GeolocationRequest;
export type GeolocationCountryRequest = GeolocationRequest;
export type GeolocationStateRequest = GeolocationRequest;
export type GeolocationCityRequest = GeolocationRequest;
export type GeolocationCurrencyRequest = GeolocationRequest;
export type GeolocationTimezoneRequest = GeolocationRequest;