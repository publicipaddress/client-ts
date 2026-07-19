const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const {
    isIP,
    isIPv4,
    isIPv6,
    isPublicIP,
    isPrivateIP,
} = require('../dist/core/types/ip');

describe('IP helpers', () => {
    describe('isIPv4', () => {
        test('accepts standard IPv4 addresses', () => {
            assert.equal(isIPv4('8.8.8.8'), true);
            assert.equal(isIPv4('192.168.1.10'), true);
            assert.equal(isIPv4('0.0.0.0'), true);
            assert.equal(isIPv4('255.255.255.255'), true);
        });

        test('rejects malformed IPv4 addresses', () => {
            assert.equal(isIPv4('256.1.2.3'), false);
            assert.equal(isIPv4('1.2.3'), false);
            assert.equal(isIPv4('1.2.3.4.5'), false);
            assert.equal(isIPv4('01.2.3.4'), false);
            assert.equal(isIPv4('1.2.3.4 '), false);
            assert.equal(isIPv4('not-an-ip'), false);
            assert.equal(isIPv4(''), false);
            assert.equal(isIPv4('.1.2.3'), false);
            assert.equal(isIPv4('1.2.3.'), false);
            assert.equal(isIPv4('1.2.3.256'), false);
            assert.equal(isIPv4('1.2.3.4.5'), false);
            assert.equal(isIPv4('1.2.3.4 '), false);
            assert.equal(isIPv4('1.2.3.-1'), false);
            assert.equal(isIPv4(null), false);
        });
    });

    describe('isIPv6', () => {
        test('accepts common IPv6 forms', () => {
            assert.equal(isIPv6('2001:db8::1'), true);
            assert.equal(isIPv6('::1'), true);
            assert.equal(isIPv6('FE80::1'), true);
            assert.equal(isIPv6('2001:0db8:85a3:0000:0000:8a2e:0370:7334'), true);
            assert.equal(isIPv6('1:2:3:4:5:6:7:8'), true);
            assert.equal(isIPv6('::'), true);
        });

        test('rejects malformed IPv6 addresses', () => {
            assert.equal(isIPv6('2001:db8:::1'), false);
            assert.equal(isIPv6('12345::1'), false);
            assert.equal(isIPv6('2001:db8::zzzz'), false);
            assert.equal(isIPv6('2001:db8::1::2'), false);
            assert.equal(isIPv6('2001:db8::1:2'), true);
            assert.equal(isIPv6('not-an-ip'), false);
            assert.equal(isIPv6(''), false);
            assert.equal(isIPv6(':::'), false);
            assert.equal(isIPv6('2001:db8::1:2:3:4:5:6:7'), false);
            assert.equal(isIPv6('2001:db8::1:2:3:4:5:6'), false);
            assert.equal(isIPv6('2001:db8::1:2:3:4:5:6:7:8'), false);
            assert.equal(isIPv6('2001::db8::1'), false);
            assert.equal(isIPv6('2001:db8:1::'), true);
            assert.equal(isIPv6('2001:db8::'), true);
            assert.equal(isIPv6(null), false);
        });
    });

    describe('isIP', () => {
        test('accepts both IPv4 and IPv6 values', () => {
            assert.equal(isIP('8.8.8.8'), true);
            assert.equal(isIP('2001:db8::1'), true);
            assert.equal(isIP('not-an-ip'), false);
            assert.equal(isIP(''), false);
            assert.equal(isIP(null), false);
        });
    });

    describe('isPublicIP', () => {
        test('flags public IPv4 and IPv6 addresses', () => {
            assert.equal(isPublicIP('8.8.8.8'), true);
            assert.equal(isPublicIP('1.1.1.1'), true);
            assert.equal(isPublicIP('2001:4860:4860::8888'), true);
            assert.equal(isPublicIP('2001:db8::1'), true);
        });

        test('treats private and reserved addresses as non-public', () => {
            assert.equal(isPublicIP('10.0.0.1'), false);
            assert.equal(isPublicIP('172.16.0.1'), false);
            assert.equal(isPublicIP('192.168.1.1'), false);
            assert.equal(isPublicIP('127.0.0.1'), false);
            assert.equal(isPublicIP('169.254.1.1'), false);
            assert.equal(isPublicIP('fc00::1'), false);
            assert.equal(isPublicIP('fe80::1'), false);
            assert.equal(isPublicIP('::1'), false);
            assert.equal(isPublicIP('::'), false);
            assert.equal(isPublicIP('fe80::1'), false);
            assert.equal(isPublicIP('not-an-ip'), false);
        });
    });

    describe('isPrivateIP', () => {
        test('flags private IPv4 and IPv6 addresses', () => {
            assert.equal(isPrivateIP('10.0.0.1'), true);
            assert.equal(isPrivateIP('172.16.0.1'), true);
            assert.equal(isPrivateIP('172.31.255.255'), true);
            assert.equal(isPrivateIP('192.168.1.1'), true);
            assert.equal(isPrivateIP('127.0.0.1'), true);
            assert.equal(isPrivateIP('169.254.1.1'), true);
            assert.equal(isPrivateIP('fc00::1'), true);
            assert.equal(isPrivateIP('fe80::1'), true);
            assert.equal(isPrivateIP('::1'), true);
            assert.equal(isPrivateIP('::'), true);
            assert.equal(isPrivateIP('fe80::1'), true);
            assert.equal(isPrivateIP('fc00::1'), true);
        });

        test('treats public addresses as non-private', () => {
            assert.equal(isPrivateIP('8.8.8.8'), false);
            assert.equal(isPrivateIP('1.1.1.1'), false);
            assert.equal(isPrivateIP('2001:4860:4860::8888'), false);
            assert.equal(isPrivateIP('not-an-ip'), false);
        });
    });
});
