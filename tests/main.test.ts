import envVarExists from '../src/main';
import { getHostname, getPlatform } from '../src/subfile';

test('env var exists', () => {
    expect(envVarExists('PATH')).toBe(true);
});

test('env var does not exist', () => {
    expect(envVarExists('accordingtoallknownlawsofaviation')).toBe(false);
});

test('hostname getter', () => {
    expect(typeof getHostname()).toBe('string');
});

test('platform getter', () => {
    expect(typeof getPlatform()).toBe('string');
});
