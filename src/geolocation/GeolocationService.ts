import type { PublicIP } from "../core/types";
import type { HttpClientLike } from "../core/httpClient";
import { GetByIpService } from "../core/getByIp";
import type {
    GeolocationLocationResponse,
    GeolocationCountryResponse,
    GeolocationCityResponse,
} from "./types";

export class GeolocationService extends GetByIpService<GeolocationLocationResponse> {
    constructor(httpClient: HttpClientLike) {
        super(httpClient);
    }

    protected async lookupByIp(ip: PublicIP): Promise<GeolocationLocationResponse> {
        const [countriesResponse, citiesResponse] = await Promise.all([
            this.httpClient.request<GeolocationCountryResponse[]>(
                this.httpClient.buildQuery("/geolocation/countries", { ip, limit: 1 }),
            ),
            this.httpClient.request<GeolocationCityResponse[]>(
                this.httpClient.buildQuery("/geolocation/cities", { ip, limit: 1 }),
            ),
        ]);

        const country = Array.isArray(countriesResponse) ? countriesResponse[0] : undefined;
        const city = Array.isArray(citiesResponse) ? citiesResponse[0] : undefined;

        return {
            city: city?.name ?? null,
            region: country?.region ?? null,
            country: country?.name ?? null,
            country_code: country?.iso2 ?? null,
            latitude: city?.latitude ?? null,
            longitude: city?.longitude ?? null,
            timezone: country?.timezones?.[0]?.zoneName ?? null,
            zip_code: null,
        };
    }
}