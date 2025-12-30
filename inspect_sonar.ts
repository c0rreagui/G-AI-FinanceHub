import 'dotenv/config';

// Credentials (re-using since we are in the same session context)
const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function fetchSonar(endpoint: string) {
    const url = `https://sonarcloud.io/api/${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }
        return response.json();
    } catch (e) {
        console.error("Fetch failed:", e);
        return { total: 0, issues: [] };
    }
}

async function main() {
    console.log('🔍 Fetching issues...');

    try {
        // Search for VULNERABILITIES
        const vulns = await fetchSonar(`issues/search?componentKeys=${PROJECT_KEY}&types=VULNERABILITY&statuses=OPEN,CONFIRMED,REOPENED`);
        console.log(`\n🔴 Vulnerabilities: ${vulns.total}`);
        vulns.issues.forEach((i: any) => console.log(`   [${i.severity}] ${i.component.split(':').pop()} L${i.line}: ${i.message}`));

        // Search for BUGS
        const bugs = await fetchSonar(`issues/search?componentKeys=${PROJECT_KEY}&types=BUG&statuses=OPEN,CONFIRMED,REOPENED&ps=20`);
        console.log(`\n🐛 Top Bugs (Showing 20 of ${bugs.total}):`);
        bugs.issues.forEach((i: any) => console.log(`   [${i.severity}] ${i.component.split(':').pop()} L${i.line}: ${i.message}`));

    } catch (error) {
        console.error('❌ Failed:', error);
    }
}

main();
