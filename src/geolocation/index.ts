import type { BuildQueryFunction, RequestFunction } from "../types";
import type {
    GeolocationRequest,
    GeolocationResponse,
    GeolocationCountryResponse,
    GeolocationCityResponse,
} from "./types";

export async function getGeolocation(
    request: RequestFunction,
    buildQuery: BuildQueryFunction,
    input: GeolocationRequest,
): Promise<GeolocationResponse> {
    const [countries, cities] = await Promise.all([
        request<GeolocationCountryResponse[]>(buildQuery("/geolocation/countries", { ip: input.ip, limit: 1 })),
        request<GeolocationCityResponse[]>(buildQuery("/geolocation/cities", { ip: input.ip, limit: 1 })),
    ]);

    const country = countries[0];
    const city = cities[0];

    return {
        city: city?.name ?? null,
        region: country?.region ?? null,
        country: country?.name ?? null,
        country_code: country?.iso2 ?? null,
        latitude: city?.latitude ?? null,
        longitude: city?.longitude ?? null,
        timezone: country?.timezones?.[0]?.zoneName ?? null,
    };
}