import type { IP, PublicIPAddressInfoConfig } from "./types";
import { HttpClient } from "./httpClient";
import { GeolocationService } from "./geolocation";
import { NetworkService } from "./network";
import { WeatherService } from "./weather";

export class PublicIPAddressInfo {
  public readonly geolocation: GeolocationService;
  public readonly network: NetworkService;
  public readonly weather: WeatherService;

  private readonly httpClient: HttpClient;

  constructor(config: PublicIPAddressInfoConfig) {
    this.httpClient = new HttpClient(config);
    this.geolocation = new GeolocationService(this.httpClient);
    this.network = new NetworkService(this.httpClient);
    this.weather = new WeatherService(this.httpClient);
  }
}
