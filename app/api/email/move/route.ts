import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { emailIds, targetFolder } = data
    
    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array de IDs de email' },
        { status: 400 }
      )
    }
    
    if (!targetFolder) {
      return NextResponse.json(
        { success: false, error: 'Se requiere especificar la carpeta destino' },
        { status: 400 }
      )
    }
    
    // En un entorno real, aquí se moverían los emails a la carpeta especificada
    console.log(`Moviendo ${emailIds.length} emails a la carpeta '${targetFolder}':`, emailIds)
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({ 
      success: true, 
      message: `${emailIds.length} emails movidos a la carpeta '${targetFolder}'`
    })
  } catch (error) {
    console.error('Error al mover emails:', error)
    return NextResponse.json(
      { success: false, error: 'Error al mover los emails' },
      { status: 500 }
    )
  }
}
 