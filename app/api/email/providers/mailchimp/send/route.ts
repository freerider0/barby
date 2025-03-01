import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // En un entorno real, aquí se haría una llamada a la API de Mandrill
    // usando el SDK oficial o fetch
    console.log('Enviando email a través de Mandrill API:', {
      apiKey: data.key ? '***' : 'No proporcionada',
      message: {
        subject: data.message.subject,
        from: `${data.message.from_name} <${data.message.from_email}>`,
        to: data.message.to,
        hasAttachments: data.message.attachments?.length > 0
      }
    })
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Simular respuesta de Mandrill
    return NextResponse.json({ 
      success: true, 
      messageId: `mandrill-${Date.now()}`,
      message: 'Email enviado correctamente a través de Mandrill'
    })
  } catch (error) {
    console.error('Error al enviar email a través de Mandrill:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar el email a través de Mandrill' },
      { status: 500 }
    )
  }
} 