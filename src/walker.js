const fs = require('fs/promises');
const path = require('path');

exports.processDirectory = async (dir) => {
  const mdFiles = [];
  
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip hidden directories and files
      if (item.name.startsWith('.')) {
        continue;
      }
      
      if (item.isDirectory()) {
        // Recursively process subdirectories
        const subDirFiles = await exports.processDirectory(fullPath);
        mdFiles.push(...subDirFiles);
      } else if (item.isFile()) {
        // Check if it's a markdown file
        const ext = path.extname(item.name).toLowerCase();
        if (ext === '.md') {
          mdFiles.push(fullPath);
        }
      }
    }
  } catch (error) {
    throw new Error(`Failed to process directory ${dir}: ${error.message}`);
  }
  
  return mdFiles;
};