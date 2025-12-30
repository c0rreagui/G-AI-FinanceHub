import 'dotenv/config';

const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function main() {
    const url = `https://sonarcloud.io/api/issues/search?componentKeys=${PROJECT_KEY}&types=BUG,VULNERABILITY&statuses=OPEN,CONFIRMED,REOPENED&ps=100`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}` }
        });
        const data = await response.json();

        console.log(`\n🐛 Found ${data.total} remaining items:\n`);

        (data.issues || []).forEach((i: any) => {
            console.log(`📄 ${i.component.split(':').pop()}`);
            console.log(`   └─ [${i.type}] [${i.severity}] L${i.line}: ${i.message}`);
        });

    } catch (e) {
        console.error(e);
    }
}

main();
