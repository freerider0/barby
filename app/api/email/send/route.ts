import { NextResponse } from 'next/server'
import { EMAIL_CONFIG } from '@/components/email/config'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { from, to, cc, bcc, subject, content, attachments } = data
    
    // En un entorno real, aquí se conectaría con un servicio de email
    // Por ahora, simulamos una respuesta exitosa
    console.log('Email enviado (simulado):', {
      from,
      to,
      cc,
      bcc,
      subject,
      content: content.substring(0, 100) + '...',
      attachments: attachments?.length || 0
    })
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({ 
      success: true, 
      messageId: `simulated-${Date.now()}`,
      message: 'Email enviado correctamente (simulado)'
    })
  } catch (error) {
    console.error('Error al enviar email:', error)
    return NextResponse.json(
      { success: false, error: 'Error al enviar el email' },
      { status: 500 }
    )
  }
} 