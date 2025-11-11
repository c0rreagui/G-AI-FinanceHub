import React, { useState } from 'react';
import { useDialog } from '../../hooks/useDialog';
import { scanReceipt } from '../../services/ocrService';
import { TransactionType } from '../../types';
import { Button } from '../ui/Button';
import { UploadCloud, Zap } from '../Icons';
import { useAuth } from '../../hooks/useAuth'; // Importar useAuth

export const ReceiptScanner: React.FC = () => {
  const { openDialog } = useDialog();
  const { apiKey } = useAuth(); // Puxar a apiKey
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!imageFile || !imagePreview) {
      setError("Por favor, selecione uma imagem primeiro.");
      return;
    }
    if (!apiKey) {
      setError("Chave de API do Gemini não configurada. Por favor, adicione sua chave na tela de 'Ajustes'.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const base64Image = imagePreview.split(',')[1];
      if (!base64Image) {
        throw new Error("Não foi possível processar a imagem. Formato inválido.");
      }
      // Chama o serviço de OCR com a apiKey
      const ocrResult = await scanReceipt(base64Image, imageFile.type, apiKey);
      
      // Abre o pop-up com os dados e um callback de sucesso
      openDialog('add-transaction', {
        prefill: {
          description: ocrResult.description || 'Recibo Scaneado',
          amount: ocrResult.amount || 0,
          type: ocrResult.type || TransactionType.DESPESA,
          date: new Date().toISOString().split('T')[0]
        },
        onSaveSuccess: () => {
            setImageFile(null);
            setImagePreview(null);
        }
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
      console.error("Erro no OCR:", err);
      setError(`Não foi possível ler o recibo. Tente uma imagem mais nítida. (${errorMessage})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-white">Scanner de Comprovantes (IA)</h3>
      <p className="text-sm text-gray-400 mt-2 mb-4">Envie um comprovante para que a IA extraia os dados da transação.</p>
      <label 
        htmlFor="receipt-upload" 
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview do recibo" className="h-full w-full object-contain rounded-lg" />
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
            <UploadCloud className="w-10 h-10 mb-3" />
            <p className="mb-2 text-sm">Clique para enviar ou arraste e solte</p>
            <p className="text-xs">(PNG, JPG ou WEBP)</p>
          </div>
        )}
        <input id="receipt-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
      </label>
      {error && (
        <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
      )}
      <Button 
        className="w-full mt-6" 
        onClick={handleScan} 
        disabled={!imageFile || isLoading}
      >
        {isLoading ? (
          'Lendo Recibo...'
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Scanear e Lançar
          </>
        )}
      </Button>
    </div>
  );
};