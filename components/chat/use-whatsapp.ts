'use client';

import { useState, useEffect, useCallback } from 'react';

// Tipos
interface WhatsAppState {
  isConnected: boolean;
  qrCode: string | null;
  messages: any[];
  contacts: any[];
  error: string | null;
}

interface SendMessageParams {
  to: string;
  message: string;
}

// Hook personalizado
export function useWhatsApp() {
  const [state, setState] = useState<WhatsAppState>({
    isConnected: false,
    qrCode: null,
    messages: [],
    contacts: [],
    error: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Función para obtener el estado de la conexión
  const fetchConnectionState = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/whatsapp');
      
      if (!response.ok) {
        throw new Error(`Error al obtener el estado: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setState(data.state);
      } else {
        setState(prev => ({ ...prev, error: data.error }));
      }
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para enviar un mensaje
  const sendMessage = useCallback(async ({ to, message }: SendMessageParams) => {
    try {
      const response = await fetch('/api/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to, message }),
      });
      
      if (!response.ok) {
        throw new Error(`Error al enviar mensaje: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return true;
    } catch (error) {
      setState(prev => ({ ...prev, error: (error as Error).message }));
      return false;
    }
  }, []);

  // Efecto para obtener el estado inicial
  useEffect(() => {
    fetchConnectionState();
    
    // Configurar un intervalo para actualizar el estado periódicamente
    const intervalId = setInterval(fetchConnectionState, 5000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [fetchConnectionState]);

  return {
    ...state,
    isLoading,
    sendMessage,
    refreshState: fetchConnectionState,
  };
} 