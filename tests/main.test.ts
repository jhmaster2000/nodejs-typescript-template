// Import without specifying the extension. `./Lib.js` would look odd in a .ts file
test('constructor', () => {
    expect(true).toBeTruthy();
});

try {
    throw new Error('testing source mapping in Jest');
} catch (e) {
    if ((e as Error).stack?.includes('.ts:')) {
        console.info('Stack trace mapped back to TypeScript should indicate correct error line number');
        console.info(e);
    }
}
