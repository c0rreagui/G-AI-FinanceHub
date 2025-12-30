import 'dotenv/config';
import fs from 'fs';

// Credentials (re-using since we are in the same session context)
const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function fetchSonar(endpoint: string) {
    const url = `https://sonarcloud.io/api/${endpoint}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    return response.json();
}

async function main() {
    console.log('🔍 Fetching top bugs from SonarCloud...');

    try {
        // Search for BUG issues, open statuses only, sorted by severity
        const searchParams = new URLSearchParams({
            componentKeys: PROJECT_KEY,
            types: 'BUG',
            statuses: 'OPEN,CONFIRMED,REOPENED',
            s: 'SEVERITY', // sort by severity
            asc: 'false',
            ps: '50' // Increased to 50
        });

        const results = await fetchSonar(`issues/search?${searchParams.toString()}`);

        console.log(`\nFound ${results.total} total open bugs. Processing top ${results.issues.length}...`);

        const bugsByFile: { [key: string]: any[] } = {};

        results.issues.forEach((issue: any) => {
            // Try to get clean filename
            const parts = issue.component.split(':');
            const file = parts.length > 1 ? parts[1] : parts[0];

            if (!bugsByFile[file]) bugsByFile[file] = [];
            bugsByFile[file].push({
                key: issue.key,
                severity: issue.severity,
                message: issue.message,
                line: issue.line,
                rule: issue.rule
            });
        });

        const report = {
            total: results.total,
            bugs: bugsByFile
        };

        fs.writeFileSync('sonar_report.json', JSON.stringify(report, null, 2));
        console.log('✅ Report saved to sonar_report.json');

    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

main();
