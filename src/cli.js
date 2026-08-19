const { Command } = require('commander');
const { version } = require('../package.json');

exports.createApp = () => {
  const app = new Command();
  
  app
    .name('md-link-extractor')
    .description('Extract links from Markdown files')
    .version(version)
    .arguments('<directory>')
    .option('-o, --output <file>', 'File to write the results to', 'links.txt')
    .option('-f, --format <type>', 'Output format: table, csv, json', 'table')
    .option('-r, --include-raw', 'Also extract raw URLs', false)
    .option('--no-line-numbers', 'Suppress line numbers in the output')
    .option('-v, --verbose', 'Print extra information', false)
    .action((directory, options) => {
      // This will be handled in index.js
    });
  
  return app;
};