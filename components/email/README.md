# Módulo de Email

Este módulo proporciona una solución completa para la gestión de correos electrónicos dentro de la aplicación, permitiendo a los usuarios enviar, recibir y administrar emails desde una interfaz unificada.

## Características

- **Interfaz de usuario completa**: Bandeja de entrada, visualización de emails, composición con editor rico.
- **Editor Tiptap**: Editor de texto enriquecido para la composición de emails con formato.
- **Gestión de carpetas**: Bandeja de entrada, enviados, borradores y papelera.
- **Etiquetas personalizables**: Organización de emails mediante etiquetas de colores.
- **Adjuntos**: Soporte para archivos adjuntos con límite de tamaño.
- **Búsqueda**: Búsqueda de emails por remitente, asunto o contenido.
- **Acciones en lote**: Selección múltiple para acciones como eliminar o mover.
- **Responder y reenviar**: Funcionalidad completa para responder y reenviar emails.
- **Configuración flexible**: Fácil integración con diferentes proveedores de email.

## Estructura del módulo

El módulo está organizado en los siguientes archivos:

- `config.ts`: Configuración central del módulo de email.
- `email-editor.tsx`: Componente de editor de email con Tiptap.
- `use-email.ts`: Hook personalizado para la gestión de emails.
- `README.md`: Documentación del módulo (este archivo).

## Configuración

El módulo se configura a través del archivo `config.ts`, que permite personalizar:

### Proveedores de email soportados

```typescript
enum EmailProvider {
  GMAIL = 'gmail',
  OUTLOOK = 'outlook',
  YAHOO = 'yahoo',
  SMTP = 'smtp',
  IMAP = 'imap',
  CUSTOM = 'custom',
  MAILCHIMP = 'mailchimp',
  SENDINBLUE = 'sendinblue',
  SENDGRID = 'sendgrid',
  POSTMARK = 'postmark',
  AMAZON_SES = 'amazon_ses'
}
```

### Configuración por proveedor

Cada proveedor puede configurarse con sus propios ajustes SMTP, IMAP y OAuth:

```typescript
interface EmailProviderConfig {
  smtp: {
    host: string
    port: number
    secure: boolean
    auth: {
      user?: string
      pass?: string
      oauth?: boolean
    }
  }
  imap: {
    host: string
    port: number
    secure: boolean
    auth: {
      user?: string
      pass?: string
      oauth?: boolean
    }
  }
  oauth?: {
    clientId: string
    clientSecret: string
    redirectUri: string
    authorizationUrl: string
    tokenUrl: string
  }
  api?: {
    baseUrl: string
    version: string
    scopes: string[]
  }
}
```

### Configuración global

```typescript
const EMAIL_CONFIG = {
  defaultProvider: EmailProvider.GMAIL,
  refreshInterval: 60000, // Intervalo de actualización en ms
  pageSize: 50, // Número de emails por página
  defaultFolders: [
    { id: 'inbox', name: 'Bandeja de entrada', icon: 'inbox' },
    { id: 'sent', name: 'Enviados', icon: 'send' },
    { id: 'drafts', name: 'Borradores', icon: 'file' },
    { id: 'trash', name: 'Papelera', icon: 'trash' }
  ],
  defaultLabels: [
    { id: 'important', name: 'Importante', color: '#ef4444' },
    { id: 'work', name: 'Trabajo', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', color: '#10b981' }
  ],
  editor: {
    placeholder: 'Escribe tu mensaje aquí...',
    maxAttachmentSize: 25 * 1024 * 1024, // 25MB
    allowedAttachmentTypes: ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx']
  },
  api: {
    send: '/api/email/send',
    receive: '/api/email/receive',
    attachments: '/api/email/attachments'
  }
}
```

## Uso

### Importar componentes

```tsx
import { EmailEditor, EmailData } from '@/components/email/email-editor'
import { useEmail } from '@/components/email/use-email'
```

### Usar el hook de email

```tsx
const { 
  emails, 
  folders, 
  labels, 
  currentFolder,
  sendEmail,
  saveAsDraft,
  deleteEmail,
  // ... más funciones
} = useEmail()
```

### Implementar el editor de email

```tsx
<EmailEditor 
  onSend={handleSendEmail}
  onSave={handleSaveDraft}
  onDiscard={handleDiscardEmail}
  initialData={initialEmailData}
  mode="compose" // 'compose', 'reply', 'forward'
/>
```

## Integración con proveedores de email

### Gmail

Para integrar con Gmail, configura las credenciales OAuth en `config.ts`:

```typescript
const GMAIL_CONFIG: EmailProviderConfig = {
  smtp: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      oauth: true
    }
  },
  imap: {
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      oauth: true
    }
  },
  oauth: {
    clientId: 'TU_CLIENT_ID',
    clientSecret: 'TU_CLIENT_SECRET',
    redirectUri: 'https://tu-app.com/auth/callback',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token'
  },
  api: {
    baseUrl: 'https://gmail.googleapis.com',
    version: 'v1',
    scopes: [
      'https://mail.google.com/',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.compose'
    ]
  }
}
```

### SMTP/IMAP personalizado

Para un servidor SMTP/IMAP personalizado:

```typescript
const CUSTOM_SMTP_CONFIG: EmailProviderConfig = {
  smtp: {
    host: 'smtp.tuservidor.com',
    port: 587,
    secure: false,
    auth: {
      user: 'usuario@tudominio.com',
      pass: 'tu_contraseña'
    }
  },
  imap: {
    host: 'imap.tuservidor.com',
    port: 143,
    secure: false,
    auth: {
      user: 'usuario@tudominio.com',
      pass: 'tu_contraseña'
    }
  }
}
```

## Proveedores de Email Marketing Soportados

Además de los proveedores de email tradicionales, el módulo también soporta los siguientes servicios de email marketing:

### Mailchimp (Mandrill)

Para integrar con Mailchimp a través de su API de transaccional Mandrill:

```typescript
const MAILCHIMP_CONFIG: EmailProviderConfig = {
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
}
```

### Sendinblue (Brevo)

Para integrar con Sendinblue (ahora conocido como Brevo):

```typescript
const SENDINBLUE_CONFIG: EmailProviderConfig = {
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
}
```

### SendGrid

Para integrar con SendGrid:

```typescript
const SENDGRID_CONFIG: EmailProviderConfig = {
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
}
```

### Postmark

Para integrar con Postmark:

```typescript
const POSTMARK_CONFIG: EmailProviderConfig = {
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
}
```

### Amazon SES

Para integrar con Amazon Simple Email Service (SES):

```typescript
const AMAZON_SES_CONFIG: EmailProviderConfig = {
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
}
```

## Uso del Adaptador de Servicios de Email

El módulo incluye un sistema de adaptadores que facilita el cambio entre diferentes proveedores de email:

```typescript
import { EmailServiceFactory, EmailMessage } from '@/components/email/email-service-adapter';
import { EmailProvider } from '@/components/email/config';

// Crear un adaptador para el proveedor deseado
const emailService = EmailServiceFactory.createAdapter(EmailProvider.MAILCHIMP);

// Enviar un email
const message: EmailMessage = {
  from: { name: 'Mi Nombre', email: 'mi.email@ejemplo.com' },
  to: [{ name: 'Destinatario', email: 'destinatario@ejemplo.com' }],
  subject: 'Asunto del email',
  content: '<p>Contenido del email en HTML</p>'
};

const result = await emailService.sendEmail(message);
if (result.success) {
  console.log(`Email enviado con ID: ${result.messageId}`);
} else {
  console.error(`Error al enviar email: ${result.error}`);
}
```

### Uso de Plantillas

Algunos proveedores como Mailchimp, Sendinblue y SendGrid soportan plantillas:

```typescript
// Obtener plantillas disponibles
const emailService = EmailServiceFactory.createAdapter(EmailProvider.SENDINBLUE);
const templates = await emailService.getTemplates();

// Enviar email usando una plantilla
const message: EmailMessage = {
  from: { name: 'Mi Nombre', email: 'mi.email@ejemplo.com' },
  to: [{ name: 'Destinatario', email: 'destinatario@ejemplo.com' }],
  subject: 'Asunto del email',
  templateId: 'template-123',
  templateData: {
    nombre: 'Juan',
    producto: 'Certificado Energético',
    fecha: '2023-05-15'
  }
};

await emailService.sendEmail(message);
```

## Implementación del backend

Para que el módulo funcione completamente, se han implementado los siguientes endpoints de API:

### Endpoints disponibles

- `GET /api/email/receive`: Obtiene la lista de emails con soporte para paginación, filtrado por carpeta y búsqueda.
- `GET /api/email/[id]`: Obtiene un email específico por su ID.
- `POST /api/email/send`: Envía un nuevo email.
- `POST /api/email/mark-read`: Marca uno o varios emails como leídos o no leídos.
- `POST /api/email/move`: Mueve uno o varios emails a una carpeta específica.
- `GET /api/email/labels`: Obtiene la lista de etiquetas disponibles.
- `POST /api/email/labels`: Gestiona las etiquetas de los emails (añadir, eliminar o establecer).

### Ejemplos de uso

#### Obtener emails
```typescript
// Obtener emails de la bandeja de entrada
const response = await fetch('/api/email/receive?folder=inbox&page=1&pageSize=20');
const { success, data } = await response.json();

if (success) {
  const { emails, total, page, pageSize, totalPages } = data;
  // Procesar los emails
}
```

#### Obtener un email específico
```typescript
const response = await fetch(`/api/email/${emailId}`);
const { success, data } = await response.json();

if (success) {
  // data contiene el email completo
  const email = data;
}
```

#### Enviar un email
```typescript
const emailData = {
  from: { name: 'Mi Nombre', email: 'mi.email@ejemplo.com' },
  to: [{ name: 'Destinatario', email: 'destinatario@ejemplo.com' }],
  cc: [],
  bcc: [],
  subject: 'Asunto del email',
  content: '<p>Contenido del email en HTML</p>',
  attachments: [] // Array de objetos con información de los adjuntos
};

const response = await fetch('/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(emailData)
});

const { success, messageId } = await response.json();
```

#### Marcar emails como leídos
```typescript
const response = await fetch('/api/email/mark-read', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailIds: ['email-1', 'email-2'],
    read: true // true para marcar como leído, false para no leído
  })
});

const { success, message } = await response.json();
```

#### Mover emails a otra carpeta
```typescript
const response = await fetch('/api/email/move', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailIds: ['email-1', 'email-2'],
    targetFolder: 'trash' // 'inbox', 'sent', 'drafts', 'trash', etc.
  })
});

const { success, message } = await response.json();
```

#### Gestionar etiquetas
```typescript
// Obtener todas las etiquetas disponibles
const labelsResponse = await fetch('/api/email/labels');
const { success, data: labels } = await labelsResponse.json();

// Añadir etiquetas a emails
const response = await fetch('/api/email/labels', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    emailIds: ['email-1', 'email-2'],
    labels: ['importante', 'cliente'],
    action: 'add' // 'add', 'remove' o 'set'
  })
});

const { success, message } = await response.json();
```

### Implementación actual

Los endpoints actuales utilizan datos simulados para demostración. En un entorno de producción, estos endpoints deberían conectarse a servicios reales de email mediante SMTP/IMAP o APIs específicas de proveedores como Gmail o Outlook.

Para implementar la versión de producción, se recomienda:

1. Configurar un servicio de autenticación OAuth para proveedores que lo requieran.
2. Implementar un sistema de almacenamiento para los emails y adjuntos.
3. Configurar un servicio de notificaciones en tiempo real para nuevos emails.
4. Implementar medidas de seguridad como cifrado de contenido y validación de remitentes.

## Consideraciones de seguridad

- **Credenciales**: Nunca almacenes contraseñas o tokens OAuth en el cliente. Utiliza variables de entorno en el servidor.
- **Autenticación**: Asegúrate de que los endpoints de API estén protegidos y solo accesibles para usuarios autenticados.
- **Validación**: Valida todos los datos de entrada para prevenir inyecciones y otros ataques.
- **Limitación de tamaño**: Limita el tamaño de los archivos adjuntos para prevenir abusos.
- **Cifrado**: Utiliza conexiones seguras (SSL/TLS) para la comunicación con servidores de email.

## Limitaciones conocidas

- La implementación actual simula la funcionalidad de email con datos de ejemplo.
- Para una implementación completa, se requiere configurar los endpoints de API y la autenticación con proveedores de email.
- El soporte para archivos adjuntos requiere una implementación de almacenamiento de archivos.
- La sincronización en tiempo real de emails requiere implementación adicional (webhooks o polling).

## Recursos adicionales

- [Documentación de Tiptap](https://tiptap.dev/docs)
- [Nodemailer para envío de emails](https://nodemailer.com/)
- [API de Gmail](https://developers.google.com/gmail/api/guides)
- [OAuth 2.0 para acceso a email](https://developers.google.com/identity/protocols/oauth2) 