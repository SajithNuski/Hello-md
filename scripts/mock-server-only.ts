// Mock 'server-only' so scripts can import lib modules in standalone Node/tsx CLI
try {
  require.cache[require.resolve("server-only")] = {
    id: require.resolve("server-only"),
    filename: require.resolve("server-only"),
    loaded: true,
    exports: {},
  } as NodeModule;
} catch {
  // Ignore if server-only cannot be resolved
}
