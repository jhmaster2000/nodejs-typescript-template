import assert from 'assert/strict';
import envVarExists from '../src/main';
import { getHostname, getPlatform } from '../src/subfile';

describe('Test Example', () => {
    it('env var exists', () => {
        assert.equal(envVarExists('PATH'), true);
    });

    it('env var does not exist', () => {
        assert.equal(envVarExists('accordingtoallknownlawsofaviation'), false);
    });

    it('hostname getter', () => {
        assert.equal(typeof getHostname(), 'string');
    });

    it('platform getter', () => {
        assert.equal(typeof getPlatform(), 'string');
    });
});
