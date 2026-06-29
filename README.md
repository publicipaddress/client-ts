# publicipaddress

A simple TypeScript client to get comprehensive information about IP addresses.

## Installation

```bash
npm install publicipaddress
```

## Quick Start

Get started in seconds to look up IP information.

```typescript
import { client } from "publicipaddress";

// Configure your API key (if needed)
client.configure({
  apiKey: "YOUR_API_KEY", // Optional: required for advanced/rate-limited features
  apiVersion: 1           // Optional: defaults to 1 (uses 'v1' in requests)
});

async function run() {
  try {
    // Get geolocation data for an IP
    const geo = await client.getGeolocation("8.8.8.8");
    console.log("Country:", geo.country);

    // Get network data for an IP
    const net = await client.getNetwork("8.8.8.8");
    console.log("ASN:", net.as_number);

    // Get weather data for an IP
    const weather = await client.getWeather("8.8.8.8");
    console.log("Weather:", weather.weather.current);
  } catch (error) {
    console.error("Error fetching IP info:", error);
  }
}

run();
```

## Supported Data Properties

### `getGeolocation(ip)`
Returns an object containing:
- `city` (string): Name of the city.
- `region` (string): Name of the state/region.
- `country` (string): Name of the country.
- `country_code` (string): ISO country code.
- `latitude` (number): Latitude coordinate.
- `longitude` (number): Longitude coordinate.
- `timezone` (string): Timezone name.
- `zip_code` (string): Postal code.

### `getNetwork(ip)`
Returns an object containing:
- `ip` (string): The requested IP address.
- `as_number` (string): The Autonomous System Number (ASN).
- `organization` (string): The network organization name.
- `version` (string): IP version (e.g., IPv4).

### `getWeather(ip)`
Returns an object containing:
- `latitude` (number): Latitude coordinate.
- `longitude` (number): Longitude coordinate.
- `weather` (object): Detailed weather data including:
    - `timezone`, `elevation`
    - `current` (temperature_2m, relative_humidity_2m, apparent_temperature, precipitation, wind_speed_10m, etc.)
    - `daily` (daily forecast data)

## Features

- **Intuitive:** Simple API design for easy discoverability.
- **Versatile:** Get comprehensive geolocation, network, and weather details for IP addresses.
- **Typed:** Built with TypeScript for excellent IDE support.

## Available Modules

| Method | Purpose |
| :--- | :--- |
| `client.getGeolocation(ip)` | Geolocation lookups |
| `client.getNetwork(ip)` | Network/AS lookups |
| `client.getWeather(ip)` | Weather conditions for an IP location |
