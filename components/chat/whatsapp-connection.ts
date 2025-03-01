import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  isJidBroadcast,
  isJidGroup,
  isJidUser,
  WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import { WHATSAPP_CONFIG, ConnectionStatus } from './config';

// Crear un emitter para manejar eventos
export const whatsappEvents = new EventEmitter();

// Directorio para almacenar los datos de autenticación
const AUTH_DIR = path.join(process.cwd(), WHATSAPP_CONFIG.AUTH_DIR);

// Asegurarse de que el directorio existe
if (!existsSync(AUTH_DIR)) {
  mkdirSync(AUTH_DIR, { recursive: true });
}

// Interfaz para el contacto
interface ContactInfo {
  id: string;
  name: string;
}

// Estado de la conexión
let connectionState = {
  status: ConnectionStatus.DISCONNECTED,
  qr: null as string | null,
  messages: [] as any[],
  contacts: [] as ContactInfo[],
  error: null as string | null,
};

// Función para iniciar la conexión con WhatsApp
export async function startWhatsAppConnection() {
  try {
    // Actualizar el estado
    connectionState.status = ConnectionStatus.CONNECTING;
    whatsappEvents.emit('connection', connectionState);
    
    // Obtener el estado de autenticación
    const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
    
    // Obtener la última versión de Baileys
    const { version } = await fetchLatestBaileysVersion();
    
    // Crear el socket de WhatsApp
    const sock = makeWASocket({
      version,
      printQRInTerminal: true,
      auth: {
        creds: state.creds,
        // @ts-ignore - Ignorar errores de tipado para simplificar
        keys: makeCacheableSignalKeyStore(state.keys, console),
      },
      // @ts-ignore - Ignorar errores de tipado para simplificar
      browser: WHATSAPP_CONFIG.BROWSER,
      getMessage: async () => {
        return { conversation: 'hello' };
      },
    });
    
    // Manejar eventos de conexión
    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;
      
      if (qr) {
        // Actualizar el código QR
        connectionState.qr = qr;
        whatsappEvents.emit('qr', qr);
      }
      
      if (connection === 'close') {
        const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
        
        connectionState.status = ConnectionStatus.DISCONNECTED;
        connectionState.error = `Conexión cerrada debido a ${(lastDisconnect?.error as Boom)?.output?.payload?.message || 'razón desconocida'}`;
        whatsappEvents.emit('connection', connectionState);
        
        if (shouldReconnect) {
          // Intentar reconectar
          setTimeout(() => {
            startWhatsAppConnection();
          }, WHATSAPP_CONFIG.RECONNECT_INTERVAL);
        }
      } else if (connection === 'open') {
        // Conexión establecida
        connectionState.status = ConnectionStatus.CONNECTED;
        connectionState.error = null;
        whatsappEvents.emit('connection', connectionState);
        
        // Cargar contactos (simulado)
        // Nota: La API de Baileys ha cambiado y getContacts puede no estar disponible
        // Esta es una implementación simulada
        try {
          // Simulación de contactos
          connectionState.contacts = [
            { id: '1234567890@s.whatsapp.net', name: 'Contacto 1' },
            { id: '0987654321@s.whatsapp.net', name: 'Contacto 2' },
          ];
          whatsappEvents.emit('contacts', connectionState.contacts);
        } catch (error) {
          console.error('Error al cargar contactos:', error);
        }
      }
    });
    
    // Manejar mensajes entrantes
    sock.ev.on('messages.upsert', ({ messages }) => {
      for (const message of messages) {
        if (!message.key.fromMe && !isJidBroadcast(message.key.remoteJid!) && !isJidGroup(message.key.remoteJid!)) {
          // Almacenar el mensaje
          connectionState.messages.push(message);
          whatsappEvents.emit('message', message);
        }
      }
    });
    
    // Guardar credenciales cuando se actualicen
    sock.ev.on('creds.update', saveCreds);
    
    return sock;
  } catch (error) {
    console.error('Error al iniciar la conexión con WhatsApp:', error);
    connectionState.status = ConnectionStatus.ERROR;
    connectionState.error = `Error al iniciar la conexión: ${(error as Error).message}`;
    whatsappEvents.emit('connection', connectionState);
    return null;
  }
}

// Función para obtener el estado actual de la conexión
export function getConnectionState() {
  return connectionState;
}

// Función para enviar un mensaje
export async function sendMessage(sock: any, to: string, message: string) {
  if (!sock || connectionState.status !== ConnectionStatus.CONNECTED) {
    throw new Error('No hay conexión con WhatsApp');
  }
  
  try {
    const jid = to.includes('@s.whatsapp.net') ? to : `${to}@s.whatsapp.net`;
    await sock.sendMessage(jid, { text: message });
    return true;
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    throw error;
  }
} 