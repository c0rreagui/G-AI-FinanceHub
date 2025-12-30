import fs from 'fs';
import path from 'path';

const dirs = ['components', 'hooks', 'utils', 'contexts', 'services', 'tests'];
const rootDir = process.cwd();

function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;

    // Replace window. with globalThis.
    // We guard against edge cases where 'window' might be a variable name, 
    // but typically window.property is what we want. 
    // To be safe, we look for ' window.' or '(window.' or 'window.' at start of line
    // Actually, widespread replacement of 'window.' to 'globalThis.' is usually safe in TS projects 
    // adhering to Sonar rules, as long as it's the global object.
    newContent = newContent.replace(/([^a-zA-Z0-9_])window\./g, '$1globalThis.');

    // Replace isNaN( with Number.isNaN(
    newContent = newContent.replace(/([^a-zA-Z0-9_])isNaN\(/g, '$1Number.isNaN(');

    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Updated: ${filePath}`);
    }
}

function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            walk(filePath);
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            processFile(filePath);
        }
    }
}

dirs.forEach(d => {
    const fullPath = path.join(rootDir, d);
    if (fs.existsSync(fullPath)) {
        walk(fullPath);
    }
});
