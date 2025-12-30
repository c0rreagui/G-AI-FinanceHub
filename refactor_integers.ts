import fs from 'fs';
import path from 'path';

const dirs = ['components', 'hooks', 'utils', 'contexts', 'services', 'tests'];
const rootDir = process.cwd();

function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content;

    // Pattern: replace "parseInt(" with "Number.parseInt("
    // We check that it isn't ALREADY Number.parseInt
    // And ideally it's not someObject.parseInt

    // Regex explanation:
    // (?<!\.) : Negative lookbehind to ensure no dot precedes parseInt (avoids Number.parseInt, someObj.parseInt)
    // \bparseInt\s*\( : matches "parseInt(" with optional whitespace
    newContent = newContent.replace(/(?<!\.)\bparseInt\s*\(/g, 'Number.parseInt(');

    // Also do parseFloat while we are at it
    newContent = newContent.replace(/(?<!\.)\bparseFloat\s*\(/g, 'Number.parseFloat(');

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
