exports.getConfig = (options) => {
  return {
    output: options.output || 'links.txt',
    format: options.format || 'table',
    includeRaw: options.includeRaw || false,
    lineNumbers: options.lineNumbers !== false, // default true
    verbose: options.verbose || false
  };
};