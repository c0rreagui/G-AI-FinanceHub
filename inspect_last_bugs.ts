import 'dotenv/config';
import fs from 'fs';

const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function main() {
    const url = `https://sonarcloud.io/api/issues/search?componentKeys=${PROJECT_KEY}&types=BUG,VULNERABILITY&statuses=OPEN,CONFIRMED,REOPENED&ps=100`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}` }
        });
        const data = await response.json();

        let output = `🐛 Found ${data.total} issues.\n\n`;
        const byFile = {};
        (data.issues || []).forEach(i => {
            const file = i.component.split(':').pop();
            if (!byFile[file]) byFile[file] = [];
            byFile[file].push(i);
        });

        Object.keys(byFile).sort().forEach(file => {
            output += `📄 ${file}\n`;
            byFile[file].forEach(i => {
                output += `   └─ [${i.severity}] L${i.line}: ${i.message}\n`;
            });
            output += '\n';
        });

        fs.writeFileSync('final_bugs_list.txt', output);
        console.log('Done.');

    } catch (e) {
        console.error(e);
    }
}

main();
