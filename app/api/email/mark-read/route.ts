import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { emailIds, read = true } = data
    
    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array de IDs de email' },
        { status: 400 }
      )
    }
    
    // En un entorno real, aquí se actualizaría el estado de los emails en la base de datos
    console.log(`Marcando ${emailIds.length} emails como ${read ? 'leídos' : 'no leídos'}:`, emailIds)
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({ 
      success: true, 
      message: `${emailIds.length} emails marcados como ${read ? 'leídos' : 'no leídos'}`
    })
  } catch (error) {
    console.error('Error al marcar emails:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar el estado de los emails' },
      { status: 500 }
    )
  }
} 