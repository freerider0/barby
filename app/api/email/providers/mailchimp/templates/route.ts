import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // En un entorno real, aquí se haría una llamada a la API de Mandrill
    // para obtener las plantillas disponibles
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Datos de ejemplo de plantillas
    const templates = [
      {
        id: 'template-1',
        name: 'Bienvenida',
        slug: 'welcome',
        date_created: '2023-01-15T10:30:00Z',
        date_modified: '2023-02-20T14:45:00Z',
        html: '<p>Plantilla de bienvenida</p>',
        publish_name: 'welcome-template',
        publish_code: 'WELCOME123',
        published_at: '2023-02-20T14:45:00Z',
        labels: ['onboarding', 'welcome']
      },
      {
        id: 'template-2',
        name: 'Confirmación de Pedido',
        slug: 'order-confirmation',
        date_created: '2023-01-20T11:15:00Z',
        date_modified: '2023-03-05T09:30:00Z',
        html: '<p>Plantilla de confirmación de pedido</p>',
        publish_name: 'order-confirmation-template',
        publish_code: 'ORDER123',
        published_at: '2023-03-05T09:30:00Z',
        labels: ['orders', 'transactional']
      },
      {
        id: 'template-3',
        name: 'Recuperación de Contraseña',
        slug: 'password-reset',
        date_created: '2023-02-10T16:45:00Z',
        date_modified: '2023-02-10T16:45:00Z',
        html: '<p>Plantilla de recuperación de contraseña</p>',
        publish_name: 'password-reset-template',
        publish_code: 'PASS123',
        published_at: '2023-02-10T16:45:00Z',
        labels: ['account', 'security']
      }
    ]
    
    return NextResponse.json({ 
      success: true, 
      templates
    })
  } catch (error) {
    console.error('Error al obtener plantillas de Mandrill:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las plantillas de Mandrill' },
      { status: 500 }
    )
  }
} 