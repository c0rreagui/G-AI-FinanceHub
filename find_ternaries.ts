import 'dotenv/config';

const SONAR_TOKEN = '144f214521765567f62aac573643187228eae901';
const PROJECT_KEY = 'c0rreagui_G-AI-FinanceHub';

async function main() {
    // Search specifically for the nested ternary rule S3358
    const url = `https://sonarcloud.io/api/issues/search?componentKeys=${PROJECT_KEY}&rules=typescript:S3358&ps=100`;

    try {
        const response = await fetch(url, {
            headers: { Authorization: `Basic ${btoa(SONAR_TOKEN + ':')}` },
        });
        const data = await response.json();

        console.log(`\n🔍 Found ${data.total} nested ternaries.\n`);

        const files: Record<string, number> = {};
        data.issues.forEach((i: any) => {
            const file = i.component.split(':').pop();
            files[file] = (files[file] || 0) + 1;
        });

        Object.entries(files)
            .sort(([, a], [, b]) => b - a)
            .forEach(([file, count]) => {
                console.log(`${count}x ${file}`);
            });

    } catch (e) {
        console.error(e);
    }
}

main();
