const { afterEach, beforeEach, describe, test } = require('node:test');
const assert = require('node:assert/strict');

const { HttpClient } = require('../dist/core/HttpClient');

const originalFetch = globalThis.fetch;

function createJsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });
}

describe('HttpClient', () => {
    beforeEach(() => {
        globalThis.fetch = async () => createJsonResponse({ ok: true });
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
    });

    test('buildQuery serializes valid params and omits undefined values', () => {
        const httpClient = new HttpClient({ apiKey: 'secret', apiVersion: 1 });

        const query = httpClient.buildQuery('/test', {
            ip: '8.8.8.8',
            limit: 1,
            empty: undefined,
            count: 2,
        });

        assert.equal(query, '/test?ip=8.8.8.8&limit=1&count=2');
    });

    test('request sends the configured auth headers and uses the API version in the URL', async () => {
        const requests = [];
        globalThis.fetch = async (url, init) => {
            requests.push({ url, init });
            return createJsonResponse({ ok: true });
        };

        const httpClient = new HttpClient({ apiKey: 'secret', apiVersion: 2, timeout: 1000 });
        const response = await httpClient.request('/weather/current');

        assert.deepEqual(response, { ok: true });
        assert.equal(requests[0].url, 'https://publicipaddress.info/api/v2/weather/current');
        assert.deepEqual(requests[0].init.headers, { Authorization: 'Bearer secret' });
    });

    test('request throws a useful error when the API responses with a failure status', async () => {
        globalThis.fetch = async () => createJsonResponse({ message: 'bad' }, 500);

        const httpClient = new HttpClient({ apiKey: 'secret', apiVersion: 1 });

        await assert.rejects(httpClient.request('/weather/current'), /API request failed: 500/);
    });

    test('request throws a timeout error when the request is aborted', async () => {
        globalThis.fetch = async (_url, init) => {
            return new Promise((_, reject) => {
                init.signal.addEventListener('abort', () => {
                    const error = new Error('Aborted');
                    error.name = 'AbortError';
                    reject(error);
                });
            });
        };

        const httpClient = new HttpClient({ apiKey: 'secret', apiVersion: 1, timeout: 10 });
        await assert.rejects(httpClient.request('/weather/current'), /timed out after 10ms/);
    });

    test('request allows timeout to be disabled with zero', async () => {
        globalThis.fetch = async () => createJsonResponse({ ok: true });

        const httpClient = new HttpClient({ apiKey: 'secret', apiVersion: 1, timeout: 0 });
        const response = await httpClient.request('/health');

        assert.deepEqual(response, { ok: true });
    });
});
