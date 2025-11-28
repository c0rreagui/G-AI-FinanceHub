import { GoogleGenAI, Type } from "@google/genai";
import { logger } from "./loggingService";
import { TransactionType } from '../types';

export interface OcrResult {
  description: string | null;
  amount: number | null;
  type: TransactionType | null;
}

const OCR_MODEL = 'gemini-1.5-pro';

/**
 * Analisa uma imagem de recibo usando a API Gemini para extrair detalhes da transação.
 * @param base64Image A imagem codificada em base64.
 * @param mimeType O tipo MIME da imagem.
 * @param apiKey A chave de API do Google Gemini.
 * @returns Uma promessa que resolve para um objeto com a descrição, o valor e o tipo da transação.
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
    text: `Você é um assistente de OCR focado em finanças. Analise esta imagem de um recibo ou comprovante. 
Extraia o nome do estabelecimento (ou a descrição principal), o valor total e o tipo de transação ('receita' ou 'despesa').
Para o tipo, infira com base em palavras como "Pagamento", "Débito", "Compra" (despesa) ou "Recebido", "Crédito", "Transferência para você" (receita). Se não tiver certeza, use 'despesa'.
Responda APENAS com um objeto JSON.

Exemplo de resposta para uma compra:
{ "description": "Nome do Estabelecimento", "amount": 120.50, "type": "despesa" }

Exemplo para um recebimento:
{ "description": "Transferência de John Doe", "amount": 200.00, "type": "receita" }

Se não conseguir encontrar os dados, retorne: { "description": null, "amount": null, "type": null }`
  };

  try {
    const response = await ai.models.generateContent({
      model: OCR_MODEL,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Nome do estabelecimento ou descrição principal" },
            amount: { type: Type.NUMBER, description: "Valor total da transação. Deve ser um número." },
            type: { type: Type.STRING, enum: ["receita", "despesa"], description: "O tipo de transação inferido." }
          },
        }
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        return { description: null, amount: null, type: null };
    }
    
    let data: OcrResult;
    try {
        data = JSON.parse(jsonText) as OcrResult;
    } catch (parseError) {
        logger.error("Erro ao fazer parse do JSON da resposta do Gemini", {
            component: "ocrService",
            function: "scanReceipt",
            jsonText: jsonText,
            error: parseError,
        });
        throw new Error("A resposta da IA não estava em um formato JSON válido.");
    }

    return {
        ...data,
        type: data.type || TransactionType.DESPESA // Garante um fallback
    };

  } catch (error) {
    logger.error("Erro ao processar o recibo com a API Gemini", {
        component: "ocrService",
        function: "scanReceipt",
        error: error
    });
    throw new Error("Falha ao analisar a imagem do recibo.");
  }
};