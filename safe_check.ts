import 'dotenv/config';

// Credentials
const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function main() {
    const url = `https://sonarcloud.io/api/measures/component?component=${PROJECT_KEY}&metricKeys=bugs,vulnerabilities,security_hotspots`;
    try {
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}` },
        });
        const data = await response.json();

        console.log('\n📊 STATUS:');
        (data.component?.measures || []).forEach((m: any) => {
            console.log(`- ${m.metric}: ${m.value}`);
        });
    } catch (e) {
        console.error(e);
    }
}

main();
