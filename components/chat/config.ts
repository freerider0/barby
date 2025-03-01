// Configuración para el módulo de chat

// Rutas de API
export const API_ROUTES = {
  WHATSAPP: '/api/whatsapp',
  MESSENGER: '/api/messenger',
  INSTAGRAM: '/api/instagram',
  EMAIL: '/api/email',
};

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  // Tiempo de espera para la reconexión (en milisegundos)
  RECONNECT_INTERVAL: 5000,
  
  // Directorio para almacenar los datos de autenticación
  AUTH_DIR: 'whatsapp-auth',
  
  // Información del navegador para la conexión
  BROWSER: ['CEE Machine', 'Chrome', '10.0'],
  
  // Tiempo de espera para la actualización del estado (en milisegundos)
  STATE_UPDATE_INTERVAL: 5000,
};

// Configuración de Messenger (para futuras implementaciones)
export const MESSENGER_CONFIG = {
  // Configuración de Facebook Messenger
  APP_ID: process.env.FACEBOOK_APP_ID || '',
  APP_SECRET: process.env.FACEBOOK_APP_SECRET || '',
  
  // URL de webhook
  WEBHOOK_URL: '/api/messenger/webhook',
};

// Configuración de Instagram (para futuras implementaciones)
export const INSTAGRAM_CONFIG = {
  // Configuración de Instagram Direct
  APP_ID: process.env.INSTAGRAM_APP_ID || '',
  APP_SECRET: process.env.INSTAGRAM_APP_SECRET || '',
  
  // URL de webhook
  WEBHOOK_URL: '/api/instagram/webhook',
};

// Configuración de Email (para futuras implementaciones)
export const EMAIL_CONFIG = {
  // Servidor SMTP
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Servidor IMAP
  IMAP_HOST: process.env.IMAP_HOST || '',
  IMAP_PORT: parseInt(process.env.IMAP_PORT || '993'),
  IMAP_USER: process.env.IMAP_USER || '',
  IMAP_PASS: process.env.IMAP_PASS || '',
};

// Tipos de mensajes
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  LOCATION = 'location',
  CONTACT = 'contact',
}

// Estados de conexión
export enum ConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  ERROR = 'error',
}

// Estados de mensajes
export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

// Plataformas de chat
export enum ChatPlatform {
  WHATSAPP = 'whatsapp',
  MESSENGER = 'messenger',
  INSTAGRAM = 'instagram',
  EMAIL = 'email',
}

// Información de los canales
export const CHANNEL_INFO = {
  [ChatPlatform.WHATSAPP]: {
    name: 'WhatsApp',
    color: '#25D366',
    icon: 'whatsapp',
    enabled: true,
  },
  [ChatPlatform.MESSENGER]: {
    name: 'Messenger',
    color: '#0084FF',
    icon: 'messenger',
    enabled: true,
  },
  [ChatPlatform.INSTAGRAM]: {
    name: 'Instagram',
    color: '#E1306C',
    icon: 'instagram',
    enabled: true,
  },
  [ChatPlatform.EMAIL]: {
    name: 'Email',
    color: '#4285F4',
    icon: 'mail',
    enabled: true,
  },
}; 