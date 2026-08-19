#!/usr/bin/env node

import { processDirectory } from '../src/walker.js';
import { extractLinks } from '../src/extractor.js';
import { reportResults } from '../src/reporter.js';
import { writeOutput } from '../src/outputWriter.js';
import { getConfig } from '../src/config.js';

// Test the functionality directly
async function test() {
  try {
    console.log('Testing Markdown Link Extractor...');
    
    // Test directory traversal
    const files = await processDirectory('.');
    console.log(`Found ${files.length} files:`);
    files.forEach(f => console.log(`  ${f}`));
    
    // Test link extraction from a single file
    const config = getConfig({ verbose: true });
    const links = await extractLinks('test.md', config);
    console.log('\nExtracted links:');
    links.forEach(link => console.log(`  ${link.file}: ${link.link} (line ${link.line})`));
    
    // Test reporting
    reportResults(links, config);
    
    // Test writing output
    await writeOutput(links, { ...config, output: 'test_output.txt', format: 'table' });
    await writeOutput(links, { ...config, output: 'test_output.json', format: 'json' });
    await writeOutput(links, { ...config, output: 'test_output.csv', format: 'csv' });
    
    console.log('Testing completed successfully!');
  } catch (error) {
    console.error('Test failed:', error.message);
    process.exit(1);
  }
}

// If run directly, execute test
if (process.argv[1] === import.meta.url) {
  test();
}

export { test };