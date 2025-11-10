import { GoogleGenAI, Type } from "@google/genai";

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
    text: `Analise a imagem deste recibo ou comprovante. Extraia a descrição principal (nome do estabelecimento ou produto principal) e o valor total pago. Retorne um objeto JSON com as chaves "description" (string) e "amount" (number). O valor deve ser um número. Se for uma despesa, o valor deve ser negativo. Se não conseguir determinar, retorne null para os campos.`
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
            description: { type: Type.STRING, description: "Descrição da transação" },
            amount: { type: Type.NUMBER, description: "Valor da transação (negativo se for despesa)" }
          },
        }
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return { description: null, amount: null };
    }
    const parsedResult = JSON.parse(jsonText);
    return {
        description: parsedResult.description || null,
        amount: parsedResult.amount || null,
    };
  } catch (error) {
    console.error("Erro ao processar recibo com Gemini:", error);
    throw new Error("Não foi possível analisar o recibo com a IA.");
  }
};
