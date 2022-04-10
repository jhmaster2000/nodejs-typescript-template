import ENV, { getHostname, getPlatform } from './subfile.js';
import test from './test.yml';

declare global {
    const someInjectedProperty: number;
}

console.log(`Hello ${getPlatform()}!`);
console.log(`Hostname: ${getHostname()}`);
console.log(test);
console.log(test.prop);
console.log(someInjectedProperty);

export default function envVarExists(envVar: string): boolean {
    if (ENV[envVar]) return true;
    else return false;
}
