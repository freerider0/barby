import { NextResponse } from 'next/server'

// Definir la interfaz para un email
interface EmailData {
  id: string;
  from: { name: string; email: string };
  to: { name: string; email: string }[];
  subject: string;
  content: string;
  date: string;
  read: boolean;
  folder: string;
  labels: string[];
  hasAttachments: boolean;
  attachments?: { name: string; size: number; type: string }[];
}

// Datos de ejemplo para simular emails
const mockEmails: Record<string, EmailData> = {
  'email-1': {
    id: 'email-1',
    from: { name: 'Juan Pérez', email: 'juan.perez@example.com' },
    to: [{ name: 'Usuario', email: 'usuario@cee-machine.com' }],
    subject: 'Consulta sobre propiedad en Bangkok',
    content: '<p>Hola,</p><p>Estoy interesado en la propiedad que tienen listada en Bangkok. ¿Podría proporcionarme más información sobre los precios y disponibilidad?</p><p>Saludos,<br>Juan</p>',
    date: new Date(Date.now() - 3600000).toISOString(),
    read: false,
    folder: 'inbox',
    labels: ['cliente', 'propiedad'],
    hasAttachments: false
  },
  'email-2': {
    id: 'email-2',
    from: { name: 'María González', email: 'maria.gonzalez@example.com' },
    to: [{ name: 'Usuario', email: 'usuario@cee-machine.com' }],
    subject: 'Documentos para certificación',
    content: '<p>Estimado equipo,</p><p>Adjunto los documentos necesarios para proceder con la certificación de la propiedad.</p><p>Quedo atenta a su respuesta.</p><p>Saludos cordiales,<br>María González</p>',
    date: new Date(Date.now() - 86400000).toISOString(),
    read: true,
    folder: 'inbox',
    labels: ['certificación'],
    hasAttachments: true,
    attachments: [
      { name: 'documentos_certificacion.pdf', size: 2500000, type: 'application/pdf' }
    ]
  },
  'email-3': {
    id: 'email-3',
    from: { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com' },
    to: [{ name: 'Usuario', email: 'usuario@cee-machine.com' }],
    subject: 'Visita a propiedad en Chiang Mai',
    content: '<p>Hola,</p><p>Me gustaría programar una visita a la propiedad que tienen en Chiang Mai para el próximo fin de semana. ¿Sería posible?</p><p>Gracias,<br>Carlos</p>',
    date: new Date(Date.now() - 172800000).toISOString(),
    read: false,
    folder: 'inbox',
    labels: ['cliente', 'visita'],
    hasAttachments: false
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const emailId = params.id
    
    // Buscar el email por ID
    const email = mockEmails[emailId]
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email no encontrado' },
        { status: 404 }
      )
    }
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return NextResponse.json({ 
      success: true, 
      data: email
    })
  } catch (error) {
    console.error('Error al obtener email:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener el email' },
      { status: 500 }
    )
  }
} 