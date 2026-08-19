#!/usr/bin/env node

const { createApp } = require('./cli');
const { processDirectory } = require('./walker');
const { extractLinks } = require('./extractor');
const { reportResults } = require('./reporter');
const { writeOutput } = require('./outputWriter');
const { getConfig } = require('./config');

const app = createApp();

app.action(async (directory, options) => {
  try {
    const config = getConfig(options);
    
    console.log(`Scanning directory: ${directory}`);
    
    // Get list of markdown files
    const mdFiles = await processDirectory(directory);
    console.log(`Found ${mdFiles.length} Markdown files.`);
    
    if (mdFiles.length === 0) {
      console.log('No Markdown files found.');
      process.exit(0);
    }
    
    // Extract links from each file
    console.log('Extracting links...');
    const allLinks = [];
    
    for (const file of mdFiles) {
      try {
        const links = await extractLinks(file, config);
        allLinks.push(...links);
      } catch (error) {
        if (config.verbose) {
          console.warn(`Warning: Failed to read file ${file}: ${error.message}`);
        }
      }
    }
    
    console.log('✔ Done.');
    
    // Report results
    reportResults(allLinks, config);
    
    // Write to file
    await writeOutput(allLinks, config);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
});

app.parse();