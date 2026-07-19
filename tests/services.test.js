const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const { GeolocationService } = require('../dist/geolocation/service');
const { NetworkService } = require('../dist/network/service');
const { WeatherService } = require('../dist/weather/service');

function createStubHttpClient(overrides = {}) {
    return {
        request: async () => overrides.response ?? null,
        buildQuery: (endpoint, params) => {
            const search = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    search.set(key, String(value));
                }
            });
            return `${endpoint}${search.toString() ? `?${search.toString()}` : ''}`;
        },
    };
}

function createGeolocationHttpClient() {
    const requests = [];

    return {
        requests,
        request: async (endpoint) => {
            requests.push(endpoint);
            if (endpoint.includes('/geolocation/countries')) {
                return [{ region: 'California', name: 'United States', iso2: 'US', timezones: [{ zoneName: 'America/Los_Angeles' }] }];
            }

            if (endpoint.includes('/geolocation/cities')) {
                return [{ name: 'San Francisco', latitude: 37.77, longitude: -122.42 }];
            }

            return [];
        },
        buildQuery: (endpoint, params) => {
            const search = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    search.set(key, String(value));
                }
            });
            return `${endpoint}${search.toString() ? `?${search.toString()}` : ''}`;
        },
    };
}

describe('service modules', () => {
    test('GeolocationService maps country and city data into the response shape', async () => {
        const httpClient = createGeolocationHttpClient();

        const service = new GeolocationService(httpClient);
        const result = await service.getByIp('8.8.8.8');

        assert.deepEqual(result, {
            city: 'San Francisco',
            region: 'California',
            country: 'United States',
            country_code: 'US',
            latitude: 37.77,
            longitude: -122.42,
            timezone: 'America/Los_Angeles',
            zip_code: null,
        });
        assert.deepEqual(httpClient.requests, [
            '/geolocation/countries?ip=8.8.8.8&limit=1',
            '/geolocation/cities?ip=8.8.8.8&limit=1',
        ]);
    });

    test('GeolocationService uses null defaults when lookup results are missing', async () => {
        const httpClient = createStubHttpClient({ response: [[], []] });
        const service = new GeolocationService(httpClient);
        const result = await service.getByIp('1.1.1.1');

        assert.deepEqual(result, {
            city: null,
            region: null,
            country: null,
            country_code: null,
            latitude: null,
            longitude: null,
            timezone: null,
            zip_code: null,
        });
    });

    test('NetworkService returns the ASN response shape', async () => {
        const httpClient = createStubHttpClient({
            response: { number: 13335, organization: 'Cloudflare, Inc.' },
        });

        const service = new NetworkService(httpClient);
        const result = await service.getByIp('1.1.1.1');

        assert.deepEqual(result, {
            number: 13335,
            organization: 'Cloudflare, Inc.',
        });
    });

    test('WeatherService returns the weather response shape', async () => {
        const httpClient = createStubHttpClient({
            response: { success: true, ip: '8.8.8.8', latitude: 37.77, longitude: -122.42, weather: { summary: 'clear' } },
        });

        const service = new WeatherService(httpClient);
        const result = await service.getByIp('8.8.8.8');

        assert.deepEqual(result, {
            success: true,
            ip: '8.8.8.8',
            latitude: 37.77,
            longitude: -122.42,
            weather: { summary: 'clear' },
        });
    });
});
