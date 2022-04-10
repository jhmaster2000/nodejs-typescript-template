import ENV, { getHostname, getPlatform } from './subfile';
import test from '../src/sample.yml';

declare global {
    const someInjectedProperty: number;
}

console.log(`Hello ${getPlatform()}!`);
console.log(`Hostname: ${getHostname()}`);
console.log(test);
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
console.log(test.parent?.child);
console.log(someInjectedProperty);
console.log(import.meta.url);

export default function envVarExists(envVar: string): boolean {
    if (ENV[envVar]) return true;
    else return false;
}
