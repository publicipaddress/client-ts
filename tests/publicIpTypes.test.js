const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

test('README-style public IP usage is accepted by TypeScript', () => {
    const repoRoot = path.resolve(__dirname, '..');
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'publicip-types-'));
    const tempFile = path.join(tempDir, 'repro.ts');

    fs.writeFileSync(
        tempFile,
        [
            "import { PublicIPAddressInfo } from '/Users/yousef/Developer/client-ts/src';",
            '',
            "const api = new PublicIPAddressInfo({ apiKey: 'test', apiVersion: 1, timeout: 10000 });",
            '',
            'async function run() {',
            "  await api.geolocation.getByIp('8.8.8.8');",
            '}',
            '',
            'run();',
            '',
        ].join('\n'),
    );

    const result = spawnSync(
        process.platform === 'win32' ? 'npx.cmd' : 'npx',
        ['tsc', '--pretty', 'false', '--noEmit', '--moduleResolution', 'node', '--target', 'es2020', '--module', 'commonjs', tempFile],
        { cwd: repoRoot, encoding: 'utf8' },
    );

    assert.equal(result.status, 0, result.stdout + result.stderr);
});
