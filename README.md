# publicipaddress

A simple TypeScript client to get comprehensive information about IP addresses.

## Installation

```bash
npm install publicipaddress
```

## Quick Start

Get started in seconds to look up IP information.

```typescript
import { PublicIPAddressInfo, type PublicIPAddressInfoConfig } from "publicipaddress";

const config: PublicIPAddressInfoConfig = {
  apiKey: "YOUR_API_KEY",
  apiVersion: 1,
  timeout: 10000,
};

const { geolocation, network, weather } = new PublicIPAddressInfo(config);

try {
  const geoData = await geolocation.getByIp("8.8.8.8");
  console.log("Country:", geoData.country);

  // Autonomous system lookup (new nested API)
  const asnData = await network.autonomousSystem.getByIp("8.8.8.8");
  console.log("ASN:", asnData);

  // Alternatively use the bracket alias for the kebab-case name:
  // await network['autonomous-system'].getByIp("8.8.8.8");

  // Network 'me' endpoint (no IP required)
  const me = await network.me.get();
  console.log("My IP:", me.ip);

  // Security endpoints (nested under network.security)
  const reports = await network.security.reports.getByIp("8.8.8.8");
  console.log("Security reports:", reports);

  const risk = await network.security.risk.getByIp("8.8.8.8");
  console.log("Risk:", risk);

  const weatherData = await weather.getByIp("8.8.8.8");
  console.log("Weather data:", weatherData.weather);
} catch (error) {
  console.error("Error fetching IP info:", error);
}

```

## Supported Data Properties

### `geolocation.getByIp(ip)`
Returns a merged geolocation object built from the `/geolocation` endpoints. It contains:
- `city` (string): Name of the city.
- `region` (string): Name of the state/region.
- `country` (string): Name of the country.
- `country_code` (string): ISO country code.
- `latitude` (number): Latitude coordinate.
- `longitude` (number): Longitude coordinate.
- `timezone` (string): Timezone name.
- `zip_code` (string): Postal code when available from the lookup endpoints.

### `network.autonomous-system.getByIp(ip)`
Returns the `/network/autonomous-systems` response (first item) containing:
- `number` (string | null): The autonomous system number.
- `organization` (string | null): The network organization name.

### `network.me.get()`
Returns the `/network/me` response containing the detected `ip` and `version`.

### `weather.getByIp(ip)`
Returns an object from `/weather/current` containing:
- `success` (boolean | null): Whether the request succeeded.
- `ip` (string | null): The requested IP address.
- `latitude` (number | null): Latitude coordinate.
- `longitude` (number | null): Longitude coordinate.
- `weather` (object | null): Detailed weather payload returned by the API.

## IP Type Verification Helpers

You can validate and classify IP addresses before making lookups:

```typescript
import {
  isIPv4,
  isIPv6,
  isIP,
  isPublicIP,
  isPrivateIP,
} from "publicipaddress";

console.log(isIPv4("8.8.8.8")); // true
console.log(isIPv6("2001:4860:4860::8888")); // true
console.log(isIP("8.8.8.8")); // true
console.log(isPublicIP("8.8.8.8")); // true
console.log(isPrivateIP("192.168.1.1")); // true
```

These helpers are useful when you want to guard user input or enforce public-only IP addresses for lookups.

## Features

- **Intuitive:** Simple API design for easy discoverability.
- **Versatile:** Get comprehensive geolocation, network, and weather details for IP addresses.
- **Typed:** Built with TypeScript for excellent IDE support.

