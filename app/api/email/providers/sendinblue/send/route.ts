import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const apiKey = request.headers.get('api-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key no proporcionada' },
        { status: 401 }
      )
    }
    
    // En un entorno real, aquí se haría una llamada a la API de Sendinblue
    // usando el SDK oficial o fetch
    console.log('Enviando email a través de Sendinblue API:', {
      apiKey: '***',
      message: {
        subject: data.subject,
        from: data.sender,
        to: data.to,
        hasAttachments: data.attachment?.length > 0,
        hasTemplate: !!data.templateId
      }
    })
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simular respuesta de Sendinblue
    return NextResponse.json({ 
      success: true, 
      messageId: `sendinblue-${Date.now()}`,
      message: 'Email enviado correctamente a través de Sendinblue'
    })
  } catch (error) {
    console.error('Error al enviar email a través de Sendinblue:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar el email a través de Sendinblue' },
      { status: 500 }
    )
  }
} 