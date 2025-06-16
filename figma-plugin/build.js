// Simple build script to compile TypeScript to JavaScript
const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const tsContent = fs.readFileSync(path.join(__dirname, 'code.ts'), 'utf8');

// Simple TypeScript to JavaScript conversion
// Remove type annotations and convert to ES5-compatible code
let jsContent = tsContent
  // Remove type annotations
  .replace(/:\s*string\s*(\||;|,|\)|\{)/g, '$1')
  .replace(/:\s*number\s*(\||;|,|\)|\{)/g, '$1')
  .replace(/:\s*boolean\s*(\||;|,|\)|\{)/g, '$1')
  .replace(/:\s*any\s*(\||;|,|\)|\{)/g, '$1')
  .replace(/:\s*void\s*(\||;|,|\)|\{)/g, '$1')
  .replace(/:\s*null\s*(\||;|,|\)|\{)/g, '$1')
  // Remove interface definitions
  .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
  // Convert async/await and other modern syntax
  .replace(/async\s+function/g, 'function')
  .replace(/await\s+/g, '')
  // Convert const/let to var for better compatibility
  .replace(/\bconst\b/g, 'var')
  .replace(/\blet\b/g, 'var');

// Write the JavaScript file
fs.writeFileSync(path.join(__dirname, 'code.js'), jsContent);

console.log('✅ Successfully compiled code.ts to code.js');