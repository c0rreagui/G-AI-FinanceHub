import { GoogleGenAI, Type } from "@google/genai";
import { logger } from "./loggingService";

export interface OcrResult {
  description: string | null;
  amount: number | null;
}

/**
 * Analisa uma imagem de recibo usando a API Gemini para extrair detalhes da transação.
 * @param base64Image A imagem codificada em base64.
 * @param mimeType O tipo MIME da imagem.
 * @param apiKey A chave de API do Google Gemini.
 * @returns Uma promessa que resolve para um objeto com a descrição e o valor.
 */
export const scanReceipt = async (base64Image: string, mimeType: string, apiKey: string): Promise<OcrResult> => {
  const ai = new GoogleGenAI({ apiKey });

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: mimeType,
    },
  };

  const textPart = {
    text: `Você é um assistente de OCR focado em finanças. Analise esta imagem de um recibo. Extraia APENAS o valor total e o nome do estabelecimento. Responda APENAS com um objeto JSON.

Exemplo de resposta:
{ "description": "Nome do Estabelecimento", "amount": 120.50 }
Se o valor for "120,50", formate para "120.50". Se você não conseguir encontrar os dados, retorne: { "description": null, "amount": null }`
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Nome do estabelecimento ou descrição principal" },
            amount: { type: Type.NUMBER, description: "Valor total da transação. Deve ser um número." }
          },
        }
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return { description: null, amount: null };
    }
    const data = JSON.parse(jsonText) as OcrResult;

    // BUG FIX: Removida a lógica que forçava o valor a ser negativo.
    // Agora, a função retorna o valor como extraído, permitindo que o usuário
    // escaneie receitas e despesas. O formulário irá sugerir o tipo correto.
    return data;

  } catch (error) {
    logger.error("Erro ao processar o recibo com a API Gemini", {
        component: "ocrService",
        function: "scanReceipt",
        error: error
    });
    throw new Error("Falha ao analisar a imagem do recibo.");
  }
};