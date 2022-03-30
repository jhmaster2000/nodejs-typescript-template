import ENV, { getHostname, getPlatform } from './subfile';

console.log(`Hello ${getPlatform()}!`);
console.log(`Hostname: ${getHostname()}`);

export default function envVarExists(envVar: string): boolean {
    if (ENV[envVar]) return true;
    else return false;
}
