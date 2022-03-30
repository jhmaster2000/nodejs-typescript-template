import os from 'os';

console.log('Hello from subfile!');

export function getPlatform(): NodeJS.Platform {
    return os.platform();
}

export function getHostname(): string {
    return os.hostname();
}

const env = process.env;
export default env;
