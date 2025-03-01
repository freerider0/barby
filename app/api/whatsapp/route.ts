import { NextRequest, NextResponse } from 'next/server';
import { startWhatsAppConnection, sendMessage, getConnectionState } from '@/components/chat/whatsapp-connection';

// Variable para almacenar la instancia del socket
let whatsappSocket: any = null;

// Iniciar la conexión cuando se importe este archivo
(async () => {
  try {
    whatsappSocket = await startWhatsAppConnection();
  } catch (error) {
    console.error('Error al iniciar la conexión de WhatsApp:', error);
  }
})();

// Endpoint para obtener el estado de la conexión
export async function GET(req: NextRequest) {
  try {
    const state = getConnectionState();
    return NextResponse.json({ success: true, state });
  } catch (error) {
    console.error('Error al obtener el estado de la conexión:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Endpoint para enviar mensajes
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, message } = body;

    if (!to || !message) {
      return NextResponse.json(
        { success: false, error: 'Se requieren los campos "to" y "message"' },
        { status: 400 }
      );
    }

    if (!whatsappSocket) {
      // Intentar reconectar si no hay socket
      whatsappSocket = await startWhatsAppConnection();
      
      if (!whatsappSocket) {
        return NextResponse.json(
          { success: false, error: 'No se pudo establecer la conexión con WhatsApp' },
          { status: 500 }
        );
      }
    }

    await sendMessage(whatsappSocket, to, message);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
} 