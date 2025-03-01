import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { emailIds, labels, action } = data
    
    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array de IDs de email' },
        { status: 400 }
      )
    }
    
    if (!labels || !Array.isArray(labels) || labels.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un array de etiquetas' },
        { status: 400 }
      )
    }
    
    if (!action || !['add', 'remove', 'set'].includes(action)) {
      return NextResponse.json(
        { success: false, error: "La acción debe ser 'add', 'remove' o 'set'" },
        { status: 400 }
      )
    }
    
    // En un entorno real, aquí se actualizarían las etiquetas de los emails
    console.log(`${action === 'add' ? 'Añadiendo' : action === 'remove' ? 'Eliminando' : 'Estableciendo'} etiquetas ${labels.join(', ')} para ${emailIds.length} emails:`, emailIds)
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({ 
      success: true, 
      message: `Etiquetas actualizadas para ${emailIds.length} emails`
    })
  } catch (error) {
    console.error('Error al actualizar etiquetas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar las etiquetas de los emails' },
      { status: 500 }
    )
  }
}

// Endpoint para obtener todas las etiquetas disponibles
export async function GET() {
  try {
    // En un entorno real, aquí se obtendrían las etiquetas de la base de datos
    const labels = [
      { id: 'cliente', name: 'Cliente', color: 'blue' },
      { id: 'propiedad', name: 'Propiedad', color: 'green' },
      { id: 'certificacion', name: 'Certificación', color: 'purple' },
      { id: 'visita', name: 'Visita', color: 'orange' },
      { id: 'importante', name: 'Importante', color: 'red' },
      { id: 'seguimiento', name: 'Seguimiento', color: 'yellow' }
    ]
    
    // Simular un pequeño retraso como en una API real
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return NextResponse.json({ 
      success: true, 
      data: labels
    })
  } catch (error) {
    console.error('Error al obtener etiquetas:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener las etiquetas' },
      { status: 500 }
    )
  }
} 