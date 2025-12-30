export const financialTips = [
    "Pague-se primeiro: reserve uma parte da sua renda para investimentos assim que receber.",
    "A regra 50-30-20 sugere: 50% para necessidades, 30% para desejos e 20% para poupança.",
    "Evite compras por impulso: espere 24 horas antes de comprar algo não essencial.",
    "Crie um fundo de emergência com 3 a 6 meses das suas despesas mensais.",
    "Revise suas assinaturas mensais e cancele o que não usa mais.",
    "Use a regra dos 72 para estimar em quanto tempo seu investimento dobrará (72 / taxa de juros).",
    "Diversifique seus investimentos para reduzir riscos.",
    "Acompanhe seus pequenos gastos diários, eles somam muito no final do mês.",
    "Defina metas financeiras claras e com prazos definidos.",
    "Negocie dívidas: credores muitas vezes aceitam descontos para quitar débitos antigos.",
    "Use cartões de crédito com sabedoria e aproveite os programas de pontos.",
    "Compare preços antes de grandes compras.",
    "Invista em conhecimento: livros e cursos sobre finanças trazem o melhor retorno.",
    "Evite dívidas de consumo com juros altos.",
    "Automatize seus investimentos para manter a disciplina.",
    "Revise seu orçamento mensalmente para ajustar desvios.",
    "Cozinhar em casa é geralmente mais barato e saudável que comer fora.",
    "Venda itens que você não usa mais para gerar renda extra.",
    "Entenda a diferença entre ativos (colocam dinheiro no bolso) e passivos (tiram dinheiro).",
    "Comece a investir cedo para aproveitar o poder dos juros compostos."
];

export const getDailyTip = (): string => {
    // Use the day of the year to select a tip, so it changes daily but stays consistent for the day
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    return financialTips[dayOfYear % financialTips.length];
};
