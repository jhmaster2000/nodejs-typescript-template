import os from 'os';
import foo from '../src/test.yml';

declare global {
    const someInjectedProperty: number;
}

console.log(foo);
console.log(foo.prop);
console.log(os.platform());
console.log(someInjectedProperty);
