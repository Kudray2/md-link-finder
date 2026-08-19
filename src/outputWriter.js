const fs = require('fs/promises');
const path = require('path');

exports.writeOutput = async (links, config) => {
  if (links.length === 0) {
    return;
  }
  
  try {
    // Make sure the output directory exists
    const outputPath = path.resolve(config.output);
    const outputDir = path.dirname(outputPath);
    
    try {
      await fs.access(outputDir);
    } catch {
      // Create directory if it doesn't exist
      await fs.mkdir(outputDir, { recursive: true });
    }
    
    let content;
    
    switch (config.format.toLowerCase()) {
      case 'csv':
        content = formatAsCSV(links);
        break;
      case 'json':
        content = formatAsJSON(links);
        break;
      case 'table':
      default:
        content = formatAsTable(links);
        break;
    }
    
    await fs.writeFile(outputPath, content);
    console.log(`\nResults written to: ${outputPath} (${config.format} format)`);
  } catch (error) {
    console.error(`Error writing to file: ${error.message}`);
    // Fallback to default file
    try {
      const fallbackPath = path.resolve('links.txt');
      await fs.writeFile(fallbackPath, formatAsTable(links));
      console.log(`Results written to fallback: ${fallbackPath}`);
    } catch (fallbackError) {
      console.error(`Fallback write failed: ${fallbackError.message}`);
    }
  }
};

const formatAsTable = (links) => {
  // For table format, we'll return a simple CSV format for now
  // since the full cli-table3 is more complex to properly handle in this context
  const lines = [];
  lines.push('File,Link,Line');
  
  links.forEach(link => {
    lines.push(`${link.file},${link.link},${link.line || ''}`);
  });
  
  return lines.join('\n');
};

const formatAsCSV = (links) => {
  const lines = [];
  lines.push('File,Link,Line');
  
  links.forEach(link => {
    const file = link.file.replace(/,/g, '\\,');
    const linkUrl = link.link.replace(/,/g, '\\,');
    lines.push(`${file},${linkUrl},${link.line || ''}`);
  });
  
  return lines.join('\n');
};

const formatAsJSON = (links) => {
  return JSON.stringify(links, null, 2);
};