const Table = require('cli-table3');
const path = require('path');

exports.reportResults = (links, config) => {
  if (links.length === 0) {
    console.log('No links found.');
    return;
  }
  
  // For console output, we need relative paths
  const formattedLinks = links.map(link => ({
    ...link,
    file: path.relative(process.cwd(), link.file)
  }));
  
  // Display table
  const table = new Table({
    head: ['File', 'Link', 'Line'],
    colWidths: [30, 50, 10]
  });
  
  formattedLinks.forEach(link => {
    table.push([
      link.file,
      link.link,
      link.line || ''
    ]);
  });
  
  console.log('\nResults:');
  console.log(table.toString());
};