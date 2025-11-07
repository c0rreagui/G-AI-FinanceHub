import { createWorker } from 'tesseract.js';

/**
 * Extrai texto de um arquivo de imagem usando Tesseract.js.
 * @param image O arquivo de imagem (File object).
 * @param progressCallback Uma função para receber atualizações de progresso.
 * @returns Uma promessa que resolve para o texto extraído.
 */
export const extractTextFromImage = async (
    image: File, 
    progressCallback: (log: any) => void
): Promise<string> => {
    
    // O logger é usado para passar o progresso para a UI.
    const worker = await createWorker('por', 1, {
        logger: progressCallback,
    });

    try {
        const { data: { text } } = await worker.recognize(image);
        return text;
    } catch (error) {
        console.error('Erro no reconhecimento do Tesseract:', error);
        throw error; // Re-lança o erro para ser tratado pelo chamador.
    } finally {
        // É crucial terminar o worker para liberar recursos.
        await worker.terminate();
    }
};
