const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const { PublicIPAddressInfo } = require('../dist/core/client/Client');

describe('PublicIPAddressInfo client', () => {
    test('constructs the client and exposes the service modules', () => {
        const client = new PublicIPAddressInfo({ apiKey: 'abc', apiVersion: 3, timeout: 2000 });

        assert.ok(client.geolocation);
        assert.ok(client.network);
        assert.ok(client.weather);
        assert.equal(client.geolocation.constructor.name, 'GeolocationService');
        assert.equal(client.network.constructor.name, 'NetworkService');
        assert.equal(client.weather.constructor.name, 'WeatherService');
    });

    test('uses default config values when options are omitted', () => {
        const client = new PublicIPAddressInfo({ apiKey: 'valid-key', apiVersion: 1 });
        assert.ok(client.geolocation);
        assert.ok(client.network);
        assert.ok(client.weather);
    });
});
