// Configuración para el módulo de email

// Tipos de proveedores de email soportados
export enum EmailProvider {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
  YAHOO = 'yahoo',
  SMTP = 'smtp',
  IMAP = 'imap',
  MAILCHIMP = 'mailchimp',
  SENDINBLUE = 'sendinblue',
  SENDGRID = 'sendgrid',
  POSTMARK = 'postmark',
  AMAZON_SES = 'amazon_ses',
  CUSTOM = 'custom',
}

// Interfaz para la configuración de proveedores
export interface EmailProviderConfig {
  type: EmailProvider;
  displayName: string;
  color: string;
  icon: string;
  enabled: boolean;
  // Configuración específica para cada proveedor
  config: {
    // Configuración SMTP para envío de emails
    smtp?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    // Configuración IMAP para recepción de emails
    imap?: {
      host: string;
      port: number;
      secure: boolean;
      auth: {
        user: string;
        pass: string;
      };
    };
    // Configuración OAuth para proveedores que lo soportan
    oauth?: {
      clientId: string;
      clientSecret: string;
      redirectUri: string;
      refreshToken?: string;
      accessToken?: string;
    };
    // Configuración API para proveedores con API propias
    api?: {
      endpoint: string;
      version: string;
      apiKey?: string;
      secretKey?: string;
      region?: string;
    };
  };
}

// Configuración por defecto para Gmail
export const GMAIL_CONFIG: EmailProviderConfig = {
  type: EmailProvider.GMAIL,
  displayName: 'Gmail',
  color: '#EA4335',
  icon: 'gmail',
  enabled: true,
  config: {
    smtp: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_PASS || '',
      },
    },
    imap: {
      host: 'imap.gmail.com',
      port: 993,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER || '',
        pass: process.env.GMAIL_PASS || '',
      },
    },
    oauth: {
      clientId: process.env.GMAIL_CLIENT_ID || '',
      clientSecret: process.env.GMAIL_CLIENT_SECRET || '',
      redirectUri: process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/gmail',
    },
  },
};

// Configuración por defecto para Outlook
export const OUTLOOK_CONFIG: EmailProviderConfig = {
  type: EmailProvider.OUTLOOK,
  displayName: 'Outlook',
  color: '#0078D4',
  icon: 'outlook',
  enabled: true,
  config: {
    smtp: {
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER || '',
        pass: process.env.OUTLOOK_PASS || '',
      },
    },
    imap: {
      host: 'outlook.office365.com',
      port: 993,
      secure: true,
      auth: {
        user: process.env.OUTLOOK_USER || '',
        pass: process.env.OUTLOOK_PASS || '',
      },
    },
    oauth: {
      clientId: process.env.OUTLOOK_CLIENT_ID || '',
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
      redirectUri: process.env.OUTLOOK_REDIRECT_URI || 'http://localhost:3000/api/auth/callback/outlook',
    },
  },
};

// Configuración por defecto para Yahoo
export const YAHOO_CONFIG: EmailProviderConfig = {
  type: EmailProvider.YAHOO,
  displayName: 'Yahoo',
  color: '#6001D2',
  icon: 'yahoo',
  enabled: true,
  config: {
    smtp: {
      host: 'smtp.mail.yahoo.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER || '',
        pass: process.env.YAHOO_PASS || '',
      },
    },
    imap: {
      host: 'imap.mail.yahoo.com',
      port: 993,
      secure: true,
      auth: {
        user: process.env.YAHOO_USER || '',
        pass: process.env.YAHOO_PASS || '',
      },
    },
  },
};

// Configuración personalizada para SMTP/IMAP genérico
export const CUSTOM_SMTP_CONFIG: EmailProviderConfig = {
  type: EmailProvider.SMTP,
  displayName: 'SMTP Personalizado',
  color: '#4285F4',
  icon: 'mail',
  enabled: true,
  config: {
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    },
    imap: {
      host: process.env.IMAP_HOST || '',
      port: parseInt(process.env.IMAP_PORT || '993'),
      secure: process.env.IMAP_SECURE === 'true',
      auth: {
        user: process.env.IMAP_USER || '',
        pass: process.env.IMAP_PASS || '',
      },
    },
  },
};

// Configuración para Mailchimp
export const MAILCHIMP_CONFIG: EmailProviderConfig = {
  type: EmailProvider.MAILCHIMP,
  displayName: 'Mailchimp',
  color: '#FFE01B',
  icon: 'mailchimp',
  enabled: true,
  config: {
    api: {
      endpoint: 'https://mandrillapp.com/api/1.0',
      version: '1.0',
      apiKey: process.env.MAILCHIMP_API_KEY || '',
    }
  }
};

// Configuración para Sendinblue (Brevo)
export const SENDINBLUE_CONFIG: EmailProviderConfig = {
  type: EmailProvider.SENDINBLUE,
  displayName: 'Brevo (Sendinblue)',
  color: '#0092FF',
  icon: 'sendinblue',
  enabled: true,
  config: {
    api: {
      endpoint: 'https://api.sendinblue.com/v3',
      version: 'v3',
      apiKey: process.env.SENDINBLUE_API_KEY || '',
    }
  }
};

// Configuración para SendGrid
export const SENDGRID_CONFIG: EmailProviderConfig = {
  type: EmailProvider.SENDGRID,
  displayName: 'SendGrid',
  color: '#1A82E2',
  icon: 'sendgrid',
  enabled: true,
  config: {
    api: {
      endpoint: 'https://api.sendgrid.com/v3',
      version: 'v3',
      apiKey: process.env.SENDGRID_API_KEY || '',
    }
  }
};

// Configuración para Postmark
export const POSTMARK_CONFIG: EmailProviderConfig = {
  type: EmailProvider.POSTMARK,
  displayName: 'Postmark',
  color: '#FFDA7A',
  icon: 'postmark',
  enabled: true,
  config: {
    api: {
      endpoint: 'https://api.postmarkapp.com',
      version: '1.0',
      apiKey: process.env.POSTMARK_API_KEY || '',
    }
  }
};

// Configuración para Amazon SES
export const AMAZON_SES_CONFIG: EmailProviderConfig = {
  type: EmailProvider.AMAZON_SES,
  displayName: 'Amazon SES',
  color: '#FF9900',
  icon: 'aws',
  enabled: true,
  config: {
    api: {
      endpoint: 'https://email.us-east-1.amazonaws.com',
      version: '2010-12-01',
      apiKey: process.env.AWS_ACCESS_KEY_ID || '',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
    }
  }
};

// Objeto que contiene todas las configuraciones de proveedores
export const EMAIL_PROVIDERS = {
  [EmailProvider.GMAIL]: GMAIL_CONFIG,
  [EmailProvider.OUTLOOK]: OUTLOOK_CONFIG,
  [EmailProvider.YAHOO]: YAHOO_CONFIG,
  [EmailProvider.SMTP]: CUSTOM_SMTP_CONFIG,
  [EmailProvider.MAILCHIMP]: MAILCHIMP_CONFIG,
  [EmailProvider.SENDINBLUE]: SENDINBLUE_CONFIG,
  [EmailProvider.SENDGRID]: SENDGRID_CONFIG,
  [EmailProvider.POSTMARK]: POSTMARK_CONFIG,
  [EmailProvider.AMAZON_SES]: AMAZON_SES_CONFIG,
};

// Configuración global del módulo de email
export const EMAIL_CONFIG = {
  // Proveedor por defecto
  defaultProvider: EmailProvider.GMAIL,
  
  // Intervalo de actualización de bandeja de entrada (en milisegundos)
  refreshInterval: 60000, // 1 minuto
  
  // Número máximo de emails a cargar por página
  pageSize: 50,
  
  // Carpetas predeterminadas
  defaultFolders: [
    { id: 'inbox', name: 'Bandeja de entrada', icon: 'inbox' },
    { id: 'sent', name: 'Enviados', icon: 'send' },
    { id: 'drafts', name: 'Borradores', icon: 'file' },
    { id: 'trash', name: 'Papelera', icon: 'trash' },
    { id: 'spam', name: 'Spam', icon: 'alert-triangle' }
  ],
  
  // Etiquetas predeterminadas
  defaultLabels: [
    { id: 'important', name: 'Importante', color: '#ef4444' },
    { id: 'work', name: 'Trabajo', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#10b981' },
    { id: 'clients', name: 'Clientes', color: '#ff9800' },
    { id: 'properties', name: 'Propiedades', color: '#9c27b0' }
  ],
  
  // Configuración del editor de email
  editor: {
    // Opciones para el editor TipTap
    tiptap: {
      // Extensiones habilitadas
      extensions: [
        'bold',
        'italic',
        'underline',
        'strike',
        'heading',
        'paragraph',
        'bulletList',
        'orderedList',
        'taskList',
        'link',
        'image',
        'blockquote',
        'codeBlock',
        'horizontalRule',
        'table',
      ],
      // Opciones de placeholder
      placeholder: 'Escribe tu mensaje aquí...',
    },
    
    // Plantillas de email predefinidas
    templates: [
      {
        id: 'welcome',
        name: 'Bienvenida',
        subject: 'Bienvenido a nuestra plataforma',
        content: '<p>Estimado/a [nombre],</p><p>Bienvenido/a a nuestra plataforma. Estamos encantados de tenerte con nosotros.</p><p>Saludos cordiales,<br>[tu nombre]</p>',
      },
      {
        id: 'followup',
        name: 'Seguimiento',
        subject: 'Seguimiento de nuestra conversación',
        content: '<p>Estimado/a [nombre],</p><p>Quería hacer un seguimiento de nuestra conversación sobre [tema].</p><p>Saludos cordiales,<br>[tu nombre]</p>',
      },
      {
        id: 'property',
        name: 'Información de propiedad',
        subject: 'Información sobre la propiedad',
        content: '<p>Estimado/a [nombre],</p><p>Adjunto encontrará la información detallada sobre la propiedad que solicitó.</p><p>Saludos cordiales,<br>[tu nombre]</p>',
      },
    ],
    
    // Tamaño máximo de adjuntos
    maxAttachmentSize: 25 * 1024 * 1024, // 25MB
    
    // Tipos de archivos permitidos para adjuntos
    allowedAttachmentTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
  },
  
  // Configuración de API
  api: {
    // Rutas de API
    routes: {
      send: '/api/email/send',
      receive: '/api/email/receive',
      getEmail: '/api/email', // Se añade el ID al final: /api/email/[id]
      markRead: '/api/email/mark-read',
      move: '/api/email/move',
      labels: '/api/email/labels',
      attachments: '/api/email/attachments',
      folders: '/api/email/folders',
      messages: '/api/email/messages',
      message: '/api/email/message',
      search: '/api/email/search'
    }
  }
} 