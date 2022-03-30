console.log('Hello World!');

try {
    throw new Error('testing source mapping');
} catch (e) {
    if ((e as Error).stack?.includes('.ts:')) {
        console.info('Stack trace mapped back to TypeScript should indicate correct error line number');
        console.info(e);
    }
}
