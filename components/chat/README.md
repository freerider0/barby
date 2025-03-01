# Módulo de Chat Integrado

Este módulo proporciona una solución completa para integrar diferentes plataformas de mensajería para la comunicación con clientes.

## Características

- **Integración con múltiples plataformas**: WhatsApp, Messenger, Instagram y Email
- **Interfaz unificada**: Gestiona todas las conversaciones desde un solo lugar
- **Diseño responsivo**: Adaptado para diferentes dispositivos
- **Gestión de contactos**: Visualización de contactos y sus plataformas disponibles
- **Historial de mensajes**: Almacenamiento y visualización de conversaciones
- **Indicadores visuales**: Identificación clara del origen de cada mensaje
- **Filtrado por canal**: Posibilidad de filtrar mensajes por plataforma
- **Envío multicanal**: Envío de mensajes a una o varias plataformas simultáneamente

## Estructura del módulo

El módulo se encuentra en el directorio `components/chat/` y contiene los siguientes archivos:

- `README.md`: Este archivo de documentación
- `config.ts`: Configuración centralizada para todas las plataformas
- `whatsapp-connection.ts`: Lógica de conexión con WhatsApp usando Baileys
- `whatsapp-chat.tsx`: Componente de interfaz para WhatsApp
- `unified-chat.tsx`: Componente de chat unificado para todas las plataformas
- `use-whatsapp.ts`: Hook personalizado para interactuar con la API

## Tecnologías utilizadas

- **Baileys**: Para la interacción con WhatsApp
- **QRCode**: Para la autenticación mediante código QR
- **Next.js API Routes**: Para la comunicación con el backend
- **React Hooks**: Para la gestión del estado
- **Tailwind CSS**: Para el diseño responsivo
- **shadcn/ui**: Para componentes de UI reutilizables

## Cómo usar

### Chat Unificado

El componente `UnifiedChat` proporciona una interfaz unificada para gestionar conversaciones de múltiples plataformas:

```tsx
import { UnifiedChat } from '@/components/chat/unified-chat';

export default function ChatPage() {
  return (
    <div>
      <h1>Centro de Comunicaciones</h1>
      <UnifiedChat />
    </div>
  );
}
```

El chat unificado ofrece las siguientes funcionalidades:

1. **Lista de contactos**: Muestra todos los contactos disponibles con indicadores de las plataformas en las que están disponibles.
2. **Área de chat**: Visualiza los mensajes con indicadores claros de la plataforma de origen.
3. **Selector de canales**: Permite elegir a qué plataformas enviar cada mensaje.
4. **Filtrado de mensajes**: Posibilidad de filtrar la conversación por plataforma.

### WhatsApp Chat

Para usar solo la funcionalidad de WhatsApp:

```tsx
import { WhatsAppChat } from '@/components/chat/whatsapp-chat';

export default function WhatsAppPage() {
  return (
    <div>
      <h1>WhatsApp</h1>
      <WhatsAppChat />
    </div>
  );
}
```

### Configuración

Puedes personalizar la configuración de cada plataforma en el archivo `config.ts`:

```typescript
// Ejemplo: Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  RECONNECT_INTERVAL: 5000,
  AUTH_DIR: 'whatsapp-auth',
  BROWSER: ['CEE Machine', 'Chrome', '10.0'],
  STATE_UPDATE_INTERVAL: 5000,
};
```

## Integración de plataformas adicionales

Para añadir soporte para nuevas plataformas:

1. Actualiza el enum `ChatPlatform` en `config.ts`
2. Añade la configuración específica de la plataforma
3. Actualiza `CHANNEL_INFO` con los detalles visuales
4. Implementa la lógica de conexión en un archivo separado
5. Integra la nueva plataforma en el componente `UnifiedChat`

## Consideraciones de seguridad

- **Almacenamiento de credenciales**: Las credenciales se almacenan localmente y deben protegerse adecuadamente
- **Uso de APIs no oficiales**: Baileys es una API no oficial para WhatsApp y su uso puede violar los términos de servicio
- **Protección de datos**: Asegúrate de cumplir con las regulaciones de protección de datos al almacenar conversaciones

## Limitaciones conocidas

- La conexión con WhatsApp requiere escanear un código QR y puede desconectarse periódicamente
- Las APIs de Messenger e Instagram requieren aprobación de Facebook
- La integración de email está limitada a las capacidades de SMTP/IMAP

## Recursos adicionales

- [Documentación de Baileys](https://github.com/WhiskeySockets/Baileys)
- [API de Facebook para Messenger](https://developers.facebook.com/docs/messenger-platform)
- [API de Instagram](https://developers.facebook.com/docs/instagram-api)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Componentes de shadcn/ui](https://ui.shadcn.com/) 