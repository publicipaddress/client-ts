const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const { validateConfig } = require('../dist/core/validation');

describe('Config Validation', () => {
    describe('validateConfig', () => {
        describe('valid configs', () => {
            test('accepts valid config with all properties', () => {
                const config = {
                    apiKey: 'c531dffc58ebfd0dc690b47ae47e04c33597fb737d8e1f3e2955e3b8e70256c8',
                    apiVersion: 1,
                    timeout: 10000,
                };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts config with required apiKey and apiVersion', () => {
                const config = { apiKey: 'test-key', apiVersion: 1 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts config with apiKey and apiVersion', () => {
                const config = { apiKey: 'test-key', apiVersion: 2 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts config with apiKey, apiVersion and timeout', () => {
                const config = { apiKey: 'test-key', apiVersion: 1, timeout: 5000 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts timeout of 0 (disabled)', () => {
                const config = { apiKey: 'test-key', apiVersion: 1, timeout: 0 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts apiVersion 1', () => {
                const config = { apiKey: 'test-key', apiVersion: 1 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts apiVersion 10', () => {
                const config = { apiKey: 'test-key', apiVersion: 10 };
                assert.doesNotThrow(() => validateConfig(config));
            });

            test('accepts large timeout values', () => {
                const config = { apiKey: 'test-key', apiVersion: 1, timeout: 999999 };
                assert.doesNotThrow(() => validateConfig(config));
            });
        });

        describe('apiKey validation', () => {
            test('throws when apiKey is missing', () => {
                const config = { apiVersion: 1, timeout: 10000 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('apiKey'));
                        return true;
                    }
                );
            });

            test('throws when apiKey is not a string', () => {
                const config = { apiKey: 123 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('apiKey'));
                        assert.ok(err.message.includes('string'));
                        return true;
                    }
                );
            });

            test('throws when apiKey is null', () => {
                const config = { apiKey: null };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when apiKey is undefined', () => {
                const config = { apiKey: undefined };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when apiKey is empty string', () => {
                const config = { apiKey: '' };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('empty'));
                        return true;
                    }
                );
            });

            test('throws when apiKey is only whitespace', () => {
                const config = { apiKey: '   ' };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('empty'));
                        return true;
                    }
                );
            });

            test('throws when apiKey is an object', () => {
                const config = { apiKey: {} };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when apiKey is an array', () => {
                const config = { apiKey: [] };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });
        });

        describe('apiVersion validation', () => {
            test('throws when apiVersion is missing', () => {
                const config = { apiKey: 'test' };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('apiVersion'));
                        return true;
                    }
                );
            });

            test('throws when apiVersion is a float', () => {
                const config = { apiKey: 'test', apiVersion: 1.5 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('integer'));
                        return true;
                    }
                );
            });

            test('throws when apiVersion is zero', () => {
                const config = { apiKey: 'test', apiVersion: 0 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('positive'));
                        return true;
                    }
                );
            });

            test('throws when apiVersion is negative', () => {
                const config = { apiKey: 'test', apiVersion: -1 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('positive'));
                        return true;
                    }
                );
            });

            test('throws when apiVersion is a string', () => {
                const config = { apiKey: 'test', apiVersion: '1' };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('number'));
                        return true;
                    }
                );
            });

            test('throws when apiVersion is null', () => {
                const config = { apiKey: 'test', apiVersion: null };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when apiVersion is Infinity', () => {
                const config = { apiKey: 'test', apiVersion: Infinity };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when apiVersion is NaN', () => {
                const config = { apiKey: 'test', apiVersion: NaN };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });
        });

        describe('timeout validation', () => {
            test('throws when timeout is a float', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: 1000.5 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('integer'));
                        return true;
                    }
                );
            });

            test('throws when timeout is negative', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: -1 };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('non-negative'));
                        return true;
                    }
                );
            });

            test('throws when timeout is a string', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: '10000' };
                assert.throws(
                    () => validateConfig(config),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('number'));
                        return true;
                    }
                );
            });

            test('throws when timeout is null', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: null };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when timeout is Infinity', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: Infinity };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });

            test('throws when timeout is NaN', () => {
                const config = { apiKey: 'test', apiVersion: 1, timeout: NaN };
                assert.throws(
                    () => validateConfig(config),
                    (err) => err instanceof Error
                );
            });
        });

        describe('overall config object validation', () => {
            test('throws when config is null', () => {
                assert.throws(
                    () => validateConfig(null),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('object'));
                        return true;
                    }
                );
            });

            test('throws when config is undefined', () => {
                assert.throws(
                    () => validateConfig(undefined),
                    (err) => {
                        assert.ok(err instanceof Error);
                        assert.ok(err.message.includes('object'));
                        return true;
                    }
                );
            });

            test('throws when config is a string', () => {
                assert.throws(
                    () => validateConfig('config'),
                    (err) => err instanceof Error
                );
            });

            test('throws when config is an array', () => {
                assert.throws(
                    () => validateConfig([]),
                    (err) => err instanceof Error
                );
            });

            test('throws when config is a number', () => {
                assert.throws(
                    () => validateConfig(123),
                    (err) => err instanceof Error
                );
            });

            test('accepts config with extra unknown properties', () => {
                const config = {
                    apiKey: 'test',
                    apiVersion: 1,
                    unknown: 'value',
                    extra: 123
                };
                assert.doesNotThrow(() => validateConfig(config));
            });
        });
    });
});
