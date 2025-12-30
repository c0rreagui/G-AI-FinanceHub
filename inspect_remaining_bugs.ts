import 'dotenv/config';
import fs from 'fs';

const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function main() {
    const url = `https://sonarcloud.io/api/issues/search?componentKeys=${PROJECT_KEY}&types=BUG,CODE_SMELL&statuses=OPEN,CONFIRMED,REOPENED&ps=500`;
    // Including CODE_SMELL to be safe, but mostly interested in BUG

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}` }
        });
        const data = await response.json();

        let output = `Found ${data.total} issues.\n\n`;

        const issues = data.issues || [];
        const byFile = {};
        issues.forEach(i => {
            const file = i.component.split(':').pop();
            if (!byFile[file]) byFile[file] = [];
            byFile[file].push(i);
        });

        Object.keys(byFile).sort().forEach(file => {
            output += `📄 ${file}\n`;
            byFile[file].forEach(i => {
                if (i.type === 'BUG') {
                    output += `   └─ [${i.severity}] L${i.line}: ${i.message} [Rules: ${i.rule}]\n`;
                }
            });
            output += '\n';
        });

        fs.writeFileSync('bugs_report.txt', output);
        console.log('Written to bugs_report.txt');

    } catch (e) {
        console.error(e);
    }
}

main();
