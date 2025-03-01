import { NextResponse } from 'next/server'
import { EMAIL_CONFIG } from '@/components/email/config'

// Datos de ejemplo para simular emails recibidos
const mockEmails = [
  {
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
  {
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
  {
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
]

export async function GET(request: Request) {
  try {
    // Obtener parámetros de la URL
    const url = new URL(request.url)
    const folder = url.searchParams.get('folder') || 'inbox'
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20')
    const search = url.searchParams.get('search') || ''
    
    // Filtrar emails por carpeta y búsqueda
    let filteredEmails = [...mockEmails]
    
    if (folder !== 'all') {
      filteredEmails = filteredEmails.filter(email => email.folder === folder)
    }
    
    if (search) {
      const searchLower = search.toLowerCase()
      filteredEmails = filteredEmails.filter(email => 
        email.subject.toLowerCase().includes(searchLower) ||
        email.content.toLowerCase().includes(searchLower) ||
        email.from.name.toLowerCase().includes(searchLower) ||
        email.from.email.toLowerCase().includes(searchLower)
      )
    }
    
    // Paginación
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedEmails = filteredEmails.slice(startIndex, endIndex)
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({ 
      success: true, 
      data: {
        emails: paginatedEmails,
        total: filteredEmails.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredEmails.length / pageSize)
      }
    })
  } catch (error) {
    console.error('Error al obtener emails:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener los emails' },
      { status: 500 }
    )
  }
} 