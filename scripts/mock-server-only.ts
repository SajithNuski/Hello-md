// Mock 'server-only' so scripts can import lib modules in standalone Node/tsx CLI
try {
  const resolved = require.resolve("server-only");
  (require.cache as any)[resolved] = {
    id: resolved,
    filename: resolved,
    loaded: true,
    exports: {},
  };
} catch {
  // Ignore if server-only cannot be resolved
}
