const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const { APIError, formatErrorMessage } = require('../dist/core/errors');

describe('APIError', () => {
    describe('constructor', () => {
        test('creates error with message, statusCode, and responseBody', () => {
            const error = new APIError('Test error', 401, { error: 'Unauthorized' });
            assert.equal(error.message, 'Test error');
            assert.equal(error.statusCode, 401);
            assert.deepEqual(error.responseBody, { error: 'Unauthorized' });
            assert.equal(error.name, 'APIError');
        });

        test('creates error with message only', () => {
            const error = new APIError('Test error');
            assert.equal(error.message, 'Test error');
            assert.equal(error.statusCode, undefined);
            assert.equal(error.responseBody, undefined);
        });

        test('creates error with message and statusCode', () => {
            const error = new APIError('Test error', 500);
            assert.equal(error.statusCode, 500);
            assert.equal(error.responseBody, undefined);
        });
    });

    describe('getUserMessage()', () => {
        describe('server response messages', () => {
            test('extracts message from { error: "..." } format', () => {
                const error = new APIError('Test', 400, { error: 'Invalid input' });
                assert.equal(error.getUserMessage(), 'Invalid input');
            });

            test('extracts message from { message: "..." } format', () => {
                const error = new APIError('Test', 400, { message: 'Bad request' });
                assert.equal(error.getUserMessage(), 'Bad request');
            });

            test('extracts message from { detail: "..." } format', () => {
                const error = new APIError('Test', 404, { detail: 'Not found' });
                assert.equal(error.getUserMessage(), 'Not found');
            });

            test('extracts message from { description: "..." } format', () => {
                const error = new APIError('Test', 500, { description: 'Server error' });
                assert.equal(error.getUserMessage(), 'Server error');
            });

            test('extracts message from nested error object { error: { message: "..." } }', () => {
                const error = new APIError('Test', 400, { error: { message: 'Nested error' } });
                assert.equal(error.getUserMessage(), 'Nested error');
            });

            test('extracts message from errors array', () => {
                const error = new APIError('Test', 400, { errors: ['First error', 'Second error'] });
                assert.equal(error.getUserMessage(), 'First error');
            });

            test('extracts message from errors array with objects', () => {
                const error = new APIError('Test', 400, {
                    errors: [{ message: 'Array error' }, { message: 'Another' }],
                });
                assert.equal(error.getUserMessage(), 'Array error');
            });

            test('prioritizes error field over message field', () => {
                const error = new APIError('Test', 400, { error: 'Error field', message: 'Message field' });
                assert.equal(error.getUserMessage(), 'Error field');
            });

            test('ignores whitespace-only strings', () => {
                const error = new APIError('Test', 400, { error: '   ', message: 'Valid message' });
                assert.equal(error.getUserMessage(), 'Valid message');
            });

            test('ignores empty strings', () => {
                const error = new APIError('Test', 400, { error: '', message: 'Valid message' });
                assert.equal(error.getUserMessage(), 'Valid message');
            });
        });

        describe('HTTP status code fallback', () => {
            test('returns standard HTTP message for 400', () => {
                const error = new APIError('Test', 400);
                const message = error.getUserMessage();
                assert.ok(message.includes('400') || message.toLowerCase().includes('bad'));
            });

            test('returns standard HTTP message for 401', () => {
                const error = new APIError('Test', 401);
                const message = error.getUserMessage();
                assert.ok(message.includes('401') || message.toLowerCase().includes('unauthorized'));
            });

            test('returns standard HTTP message for 403', () => {
                const error = new APIError('Test', 403);
                const message = error.getUserMessage();
                assert.ok(message.includes('403') || message.toLowerCase().includes('forbidden'));
            });

            test('returns standard HTTP message for 404', () => {
                const error = new APIError('Test', 404);
                const message = error.getUserMessage();
                assert.ok(message.includes('404') || message.toLowerCase().includes('not found'));
            });

            test('returns standard HTTP message for 429', () => {
                const error = new APIError('Test', 429);
                const message = error.getUserMessage();
                assert.ok(message.includes('429') || message.toLowerCase().includes('too many'));
            });

            test('returns standard HTTP message for 500', () => {
                const error = new APIError('Test', 500);
                const message = error.getUserMessage();
                assert.ok(message.includes('500') || message.toLowerCase().includes('internal'));
            });

            test('returns standard HTTP message for 502', () => {
                const error = new APIError('Test', 502);
                const message = error.getUserMessage();
                assert.ok(message.includes('502') || message.toLowerCase().includes('bad gateway'));
            });

            test('returns standard HTTP message for 503', () => {
                const error = new APIError('Test', 503);
                const message = error.getUserMessage();
                assert.ok(message.includes('503') || message.toLowerCase().includes('service unavailable'));
            });

            test('returns standard HTTP message for 504', () => {
                const error = new APIError('Test', 504);
                const message = error.getUserMessage();
                assert.ok(message.includes('504') || message.toLowerCase().includes('gateway timeout'));
            });

            test('returns generic error message for unknown status code', () => {
                const error = new APIError('Test', 999);
                const message = error.getUserMessage();
                assert.ok(message.includes('999') || message.includes('HTTP Error'));
            });
        });

        describe('fallback to generic message', () => {
            test('returns generic message when no server response and no status code', () => {
                const error = new APIError('Test');
                assert.equal(error.getUserMessage(), 'An unexpected error occurred');
            });

            test('server message takes precedence over HTTP status', () => {
                const error = new APIError('Test', 401, { error: 'Custom auth error' });
                assert.equal(error.getUserMessage(), 'Custom auth error');
            });
        });

        describe('edge cases', () => {
            test('handles null responseBody', () => {
                const error = new APIError('Test', 400, null);
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles undefined responseBody', () => {
                const error = new APIError('Test', 400, undefined);
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles empty object responseBody', () => {
                const error = new APIError('Test', 400, {});
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles array responseBody', () => {
                const error = new APIError('Test', 400, []);
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles string responseBody', () => {
                const error = new APIError('Test', 400, 'string response');
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles number responseBody', () => {
                const error = new APIError('Test', 400, 123);
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles deeply nested error objects', () => {
                const error = new APIError('Test', 400, {
                    data: { error: { nested: { message: 'Deep error' } } },
                });
                const message = error.getUserMessage();
                assert.ok(message);
            });

            test('handles errors array with mixed types', () => {
                const error = new APIError('Test', 400, {
                    errors: [null, 'String error', {}, { message: 'Object error' }],
                });
                assert.equal(error.getUserMessage(), 'String error');
            });

            test('handles empty errors array', () => {
                const error = new APIError('Test', 400, { errors: [] });
                const message = error.getUserMessage();
                assert.ok(message);
            });
        });
    });

    describe('instanceof check', () => {
        test('error is instance of APIError', () => {
            const error = new APIError('Test');
            assert.ok(error instanceof APIError);
        });

        test('error is instance of Error', () => {
            const error = new APIError('Test');
            assert.ok(error instanceof Error);
        });
    });
});

describe('formatErrorMessage', () => {
    describe('APIError formatting', () => {
        test('formats APIError with statusCode', () => {
            const error = new APIError('Test', 401, { error: 'Auth failed' });
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('API Error'));
            assert.ok(formatted.includes('401'));
            assert.ok(formatted.includes('Auth failed'));
        });

        test('formats APIError without statusCode', () => {
            const error = new APIError('Test', undefined, { error: 'Some error' });
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('API Error'));
            assert.ok(formatted.includes('Some error'));
            assert.ok(!formatted.includes('undefined'));
        });

        test('formats APIError with HTTP status message', () => {
            const error = new APIError('Test', 404);
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('API Error'));
            assert.ok(formatted.includes('404'));
        });
    });

    describe('regular Error formatting', () => {
        test('formats regular Error', () => {
            const error = new Error('Regular error message');
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('Error'));
            assert.ok(formatted.includes('Regular error message'));
        });

        test('formats Error with empty message', () => {
            const error = new Error('');
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('Error'));
        });
    });

    describe('unknown error types', () => {
        test('formats string error', () => {
            const formatted = formatErrorMessage('String error');
            assert.ok(formatted.includes('Error'));
            assert.ok(formatted.includes('String error'));
        });

        test('formats number error', () => {
            const formatted = formatErrorMessage(123);
            assert.ok(formatted.includes('Error'));
            assert.ok(formatted.includes('123'));
        });

        test('formats null error', () => {
            const formatted = formatErrorMessage(null);
            assert.ok(formatted.includes('Error'));
        });

        test('formats undefined error', () => {
            const formatted = formatErrorMessage(undefined);
            assert.ok(formatted.includes('Error'));
        });

        test('formats object error', () => {
            const formatted = formatErrorMessage({ custom: 'error' });
            assert.ok(formatted.includes('Error'));
        });
    });

    describe('edge cases', () => {
        test('handles error with special characters in server response', () => {
            const error = new APIError('Test', 400, { error: 'Error <script>alert("xss")</script>' });
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('script'));
        });

        test('handles very long error messages', () => {
            const longMessage = 'a'.repeat(10000);
            const error = new APIError('Test', 400, { error: longMessage });
            const formatted = formatErrorMessage(error);
            assert.ok(formatted.includes('aaaa'));
        });

        test('output is always a string', () => {
            const errors = [
                new APIError('Test', 401),
                new Error('Test'),
                'string',
                123,
                null,
                undefined,
                {},
            ];
            errors.forEach((err) => {
                const formatted = formatErrorMessage(err);
                assert.equal(typeof formatted, 'string');
                assert.ok(formatted.length > 0);
            });
        });
    });
});
