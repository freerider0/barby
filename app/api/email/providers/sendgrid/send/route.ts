import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'API key no proporcionada' },
        { status: 401 }
      )
    }
    
    // En un entorno real, aquí se haría una llamada a la API de SendGrid
    // usando el SDK oficial o fetch
    console.log('Enviando email a través de SendGrid API:', {
      apiKey: '***',
      message: {
        subject: data.subject,
        from: data.from,
        to: data.personalizations?.[0]?.to,
        hasAttachments: data.attachments?.length > 0,
        hasTemplate: !!data.template_id
      }
    })
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simular respuesta de SendGrid
    return NextResponse.json({ 
      success: true, 
      messageId: `sendgrid-${Date.now()}`,
      message: 'Email enviado correctamente a través de SendGrid'
    })
  } catch (error) {
    console.error('Error al enviar email a través de SendGrid:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar el email a través de SendGrid' },
      { status: 500 }
    )
  }
} 