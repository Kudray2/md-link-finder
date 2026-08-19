const fs = require('fs');
const readline = require('readline');

// Regex patterns for different link types
const patterns = {
  // Inline links [text](url)
  inline: /\[([^\]]+)\]\(([^)]+)\)/g,
  // Reference links [text][id] and reference definitions [id]: url
  reference: /\[([^\]]+)\]\[([^\]]+)\]/g,
  referenceDef: /\[([^\]]+)\]:\s*(\S+)/g,
  // Autolinks <url>
  autolink: /<([^>]+)>/g,
  // Raw URLs (when includeRaw is enabled)
  raw: /(?:^|\s)(https?:\/\/|file:\/\/)[^\s<>()]*(?=\s|$)/g
};

exports.extractLinks = async (filePath, config) => {
  const links = [];
  const fileStream = fs.createReadStream(filePath, 'utf8');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  let lineNumber = 0;
  
  for await (const line of rl) {
    lineNumber++;
    
    // Extract inline links
    let match;
    while ((match = patterns.inline.exec(line)) !== null) {
      const url = match[2];
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
        links.push({
          file: filePath,
          link: url,
          line: config.lineNumbers ? lineNumber : undefined
        });
      }
    }
    
    // Extract autolinks
    while ((match = patterns.autolink.exec(line)) !== null) {
      const url = match[1];
      if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
        links.push({
          file: filePath,
          link: url,
          line: config.lineNumbers ? lineNumber : undefined
        });
      }
    }
    
    // Extract raw URLs if enabled
    if (config.includeRaw) {
     while ((match = patterns.raw.exec(line)) !== null) {
        const url = match[0].trim();
        if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('file://')) {
          links.push({
            file: filePath,
            link: url,
            line: config.lineNumbers ? lineNumber : undefined
          });
        }
      }
    }
  }
  
  return links;
};