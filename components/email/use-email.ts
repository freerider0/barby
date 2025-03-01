'use client'

import { useState, useEffect, useCallback } from 'react'
import { EmailData as EditorEmailData } from './email-editor'
import { EMAIL_CONFIG } from './config'
import { EmailServiceFactory, EmailMessage, SendResponse } from './email-service-adapter'
import { EmailProvider } from './config'

export interface Email {
  id: string
  from: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  content: string
  attachments?: {
    name: string
    size: number
    url: string
  }[]
  date: Date
  read: boolean
  starred: boolean
  folder: string
  labels?: string[]
}

export interface EmailFolder {
  id: string
  name: string
  count: number
  unread: number
}

export interface EmailLabel {
  id: string
  name: string
  color: string
}

export interface UseEmailReturn {
  emails: Email[]
  folders: EmailFolder[]
  labels: EmailLabel[]
  currentFolder: string
  currentEmail: Email | null
  loading: boolean
  error: string | null
  sendEmail: (emailData: EditorEmailData) => Promise<boolean>
  saveAsDraft: (emailData: EditorEmailData) => Promise<boolean>
  deleteEmail: (id: string) => Promise<boolean>
  markAsRead: (id: string, read?: boolean) => Promise<boolean>
  markAsStarred: (id: string, starred?: boolean) => Promise<boolean>
  moveToFolder: (id: string, folder: string) => Promise<boolean>
  addLabel: (id: string, label: string) => Promise<boolean>
  removeLabel: (id: string, label: string) => Promise<boolean>
  setCurrentFolder: (folder: string) => void
  setCurrentEmail: (email: Email | null) => void
  refreshEmails: () => Promise<void>
  getTemplates: (provider?: EmailProvider) => Promise<any[]>
}

// Extender la interfaz EmailData para incluir los campos adicionales
interface ExtendedEmailData extends EditorEmailData {
  templateId?: string;
  templateData?: Record<string, any>;
}

export function useEmail(): UseEmailReturn {
  const [emails, setEmails] = useState<Email[]>([])
  const [folders, setFolders] = useState<EmailFolder[]>([])
  const [labels, setLabels] = useState<EmailLabel[]>([])
  const [currentFolder, setCurrentFolder] = useState<string>(
    EMAIL_CONFIG.defaultFolders && EMAIL_CONFIG.defaultFolders.length > 0 
      ? EMAIL_CONFIG.defaultFolders[0].id 
      : 'inbox'
  )
  const [currentEmail, setCurrentEmail] = useState<Email | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())

  // Fetch emails from the API
  const fetchEmails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // In a real implementation, this would be an API call
      // For now, we'll simulate it with a timeout
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate API response with mock data
      const mockEmails: Email[] = [
        {
          id: '1',
          from: 'cliente1@example.com',
          to: ['agencia@example.com'],
          subject: 'Consulta sobre propiedades en Bangkok',
          content: '<p>Hola, estoy interesado en conocer más detalles sobre las propiedades que tienen disponibles en Bangkok. ¿Podrían enviarme información?</p>',
          date: new Date(2023, 10, 15, 9, 30),
          read: true,
          starred: false,
          folder: 'inbox',
          labels: ['cliente', 'consulta']
        },
        {
          id: '2',
          from: 'agencia@example.com',
          to: ['cliente2@example.com'],
          subject: 'Información sobre su propiedad',
          content: '<p>Estimado cliente, adjunto encontrará los detalles sobre la propiedad que visitamos la semana pasada. Por favor, revise la documentación y hágame saber si tiene alguna pregunta.</p>',
          date: new Date(2023, 10, 14, 15, 45),
          read: true,
          starred: true,
          folder: 'sent',
          attachments: [
            {
              name: 'detalles_propiedad.pdf',
              size: 2500000,
              url: '#'
            }
          ]
        },
        {
          id: '3',
          from: 'proveedor@example.com',
          to: ['agencia@example.com'],
          subject: 'Actualización de servicios',
          content: '<p>Estimados, les informamos que hemos actualizado nuestros servicios de fotografía inmobiliaria. Ahora incluimos tours virtuales en 3D sin costo adicional.</p>',
          date: new Date(2023, 10, 13, 11, 20),
          read: false,
          starred: false,
          folder: 'inbox'
        },
        {
          id: '4',
          from: 'agencia@example.com',
          to: ['cliente3@example.com'],
          cc: ['gerente@example.com'],
          subject: 'Contrato de arrendamiento',
          content: '<p>Adjunto el contrato de arrendamiento para su revisión. Por favor, firme y devuelva a la brevedad posible.</p>',
          date: new Date(2023, 10, 12, 16, 30),
          read: true,
          starred: false,
          folder: 'sent',
          attachments: [
            {
              name: 'contrato_arrendamiento.pdf',
              size: 1800000,
              url: '#'
            }
          ]
        },
        {
          id: '5',
          from: 'newsletter@realestate.com',
          to: ['agencia@example.com'],
          subject: 'Tendencias del mercado inmobiliario en Tailandia',
          content: '<p>Descubra las últimas tendencias del mercado inmobiliario en Tailandia en nuestro informe mensual.</p>',
          date: new Date(2023, 10, 11, 8, 15),
          read: false,
          starred: false,
          folder: 'inbox',
          labels: ['newsletter']
        }
      ]
      
      const mockFolders: EmailFolder[] = [
        { id: 'inbox', name: 'Bandeja de entrada', count: 3, unread: 2 },
        { id: 'sent', name: 'Enviados', count: 2, unread: 0 },
        { id: 'drafts', name: 'Borradores', count: 1, unread: 0 },
        { id: 'trash', name: 'Papelera', count: 0, unread: 0 }
      ]
      
      const mockLabels: EmailLabel[] = [
        { id: 'cliente', name: 'Cliente', color: '#4f46e5' },
        { id: 'consulta', name: 'Consulta', color: '#10b981' },
        { id: 'importante', name: 'Importante', color: '#ef4444' },
        { id: 'newsletter', name: 'Newsletter', color: '#f59e0b' }
      ]
      
      setEmails(mockEmails)
      setFolders(mockFolders)
      setLabels(mockLabels)
    } catch (err) {
      setError('Error al cargar los emails')
      console.error('Error fetching emails:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch and refresh on interval
  useEffect(() => {
    fetchEmails()
    
    // Set up refresh interval if configured
    if (EMAIL_CONFIG.refreshInterval) {
      const intervalId = setInterval(() => {
        setLastRefresh(Date.now())
      }, EMAIL_CONFIG.refreshInterval)
      
      return () => clearInterval(intervalId)
    }
  }, [fetchEmails])
  
  // Refresh when lastRefresh changes
  useEffect(() => {
    if (lastRefresh) {
      fetchEmails()
    }
  }, [lastRefresh, fetchEmails])

  // Send email
  const sendEmail = async (emailData: EditorEmailData): Promise<boolean> => {
    try {
      setLoading(true)
      
      // Obtener el proveedor configurado
      const provider = EMAIL_CONFIG.defaultProvider
      
      // Crear el adaptador para el proveedor
      const emailService = EmailServiceFactory.createAdapter(provider)
      
      // Transformar los datos al formato del adaptador
      const message: EmailMessage = {
        from: {
          name: typeof emailData.from === 'string' 
            ? emailData.from 
            : emailData.from.name || 'Usuario',
          email: typeof emailData.from === 'string' 
            ? emailData.from 
            : emailData.from.email
        },
        to: Array.isArray(emailData.to) 
          ? emailData.to.map(recipient => {
              if (typeof recipient === 'string') {
                return { name: '', email: recipient };
              }
              return { name: recipient.name || '', email: recipient.email };
            })
          : [{ name: '', email: emailData.to as unknown as string }],
        cc: emailData.cc ? emailData.cc.map(recipient => {
          if (typeof recipient === 'string') {
            return { name: '', email: recipient };
          }
          return { name: recipient.name || '', email: recipient.email };
        }) : undefined,
        bcc: emailData.bcc ? emailData.bcc.map(recipient => {
          if (typeof recipient === 'string') {
            return { name: '', email: recipient };
          }
          return { name: recipient.name || '', email: recipient.email };
        }) : undefined,
        subject: emailData.subject,
        content: emailData.content,
        attachments: emailData.attachments?.map(attachment => ({
          name: attachment.name,
          size: attachment.size,
          type: attachment.type || 'application/octet-stream',
          content: (attachment as any).content // Base64 o URL
        })),
        templateId: (emailData as ExtendedEmailData).templateId,
        templateData: (emailData as ExtendedEmailData).templateData
      }
      
      // Enviar el email a través del adaptador
      const result: SendResponse = await emailService.sendEmail(message)
      
      if (result.success) {
        // Simular la adición del email a la carpeta de enviados
        const newEmail: Email = {
          id: result.messageId || `email-${Date.now()}`,
          from: typeof emailData.from === 'string' ? emailData.from : emailData.from.email,
          to: Array.isArray(emailData.to) 
            ? emailData.to.map(recipient => typeof recipient === 'string' ? recipient : recipient.email)
            : [emailData.to as unknown as string],
          cc: emailData.cc?.map(recipient => typeof recipient === 'string' ? recipient : recipient.email),
          bcc: emailData.bcc?.map(recipient => typeof recipient === 'string' ? recipient : recipient.email),
          subject: emailData.subject,
          content: emailData.content,
          date: new Date(),
          read: true,
          folder: 'sent',
          labels: [],
          starred: false,
          attachments: emailData.attachments?.map(attachment => ({
            name: attachment.name,
            size: attachment.size,
            url: (attachment as any).content || '#'
          }))
        }
        
        setEmails(prev => [newEmail, ...prev])
        return true
      } else {
        console.error('Error al enviar email:', result.error)
        return false
      }
    } catch (error) {
      console.error('Error al enviar email:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Save as draft
  const saveAsDraft = async (emailData: EditorEmailData): Promise<boolean> => {
    try {
      setLoading(true)
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Simulate successful save
      const newDraft: Email = {
        id: `draft-${Date.now()}`,
        from: emailData.from,
        to: emailData.to,
        cc: emailData.cc,
        bcc: emailData.bcc,
        subject: emailData.subject,
        content: emailData.content,
        date: new Date(),
        read: true,
        starred: false,
        folder: 'drafts',
        attachments: emailData.attachments ? emailData.attachments.map(file => ({
          name: file.name,
          size: file.size,
          url: '#'
        })) : undefined
      }
      
      setEmails(prev => [newDraft, ...prev])
      
      // Update folder counts
      setFolders(prev => prev.map(folder => 
        folder.id === 'drafts' 
          ? { ...folder, count: folder.count + 1 } 
          : folder
      ))
      
      return true
    } catch (err) {
      setError('Error al guardar el borrador')
      console.error('Error saving draft:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Delete email
  const deleteEmail = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Find the email to delete
      const emailToDelete = emails.find(email => email.id === id)
      if (!emailToDelete) return false
      
      // Move to trash or delete permanently if already in trash
      if (emailToDelete.folder === 'trash') {
        // Remove completely
        setEmails(prev => prev.filter(email => email.id !== id))
      } else {
        // Move to trash
        setEmails(prev => prev.map(email => 
          email.id === id 
            ? { ...email, folder: 'trash' } 
            : email
        ))
        
        // Update folder counts
        setFolders(prev => prev.map(folder => {
          if (folder.id === 'trash') {
            return { ...folder, count: folder.count + 1 }
          }
          if (folder.id === emailToDelete.folder) {
            return { 
              ...folder, 
              count: folder.count - 1,
              unread: emailToDelete.read ? folder.unread : folder.unread - 1
            }
          }
          return folder
        }))
      }
      
      return true
    } catch (err) {
      setError('Error al eliminar el email')
      console.error('Error deleting email:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Mark as read/unread
  const markAsRead = async (id: string, read = true): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Find the email
      const emailToUpdate = emails.find(email => email.id === id)
      if (!emailToUpdate) return false
      
      // Update read status
      setEmails(prev => prev.map(email => 
        email.id === id 
          ? { ...email, read } 
          : email
      ))
      
      // Update folder unread count
      if (emailToUpdate.read !== read) {
        setFolders(prev => prev.map(folder => {
          if (folder.id === emailToUpdate.folder) {
            return { 
              ...folder, 
              unread: read 
                ? folder.unread - 1 
                : folder.unread + 1 
            }
          }
          return folder
        }))
      }
      
      return true
    } catch (err) {
      setError('Error al actualizar el estado de lectura')
      console.error('Error marking as read:', err)
      return false
    }
  }

  // Mark as starred/unstarred
  const markAsStarred = async (id: string, starred = true): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update starred status
      setEmails(prev => prev.map(email => 
        email.id === id 
          ? { ...email, starred } 
          : email
      ))
      
      return true
    } catch (err) {
      setError('Error al actualizar el estado destacado')
      console.error('Error marking as starred:', err)
      return false
    }
  }

  // Move to folder
  const moveToFolder = async (id: string, folder: string): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Find the email
      const emailToMove = emails.find(email => email.id === id)
      if (!emailToMove) return false
      
      // Update folder
      setEmails(prev => prev.map(email => 
        email.id === id 
          ? { ...email, folder } 
          : email
      ))
      
      // Update folder counts
      setFolders(prev => prev.map(f => {
        if (f.id === folder) {
          return { 
            ...f, 
            count: f.count + 1,
            unread: emailToMove.read ? f.unread : f.unread + 1
          }
        }
        if (f.id === emailToMove.folder) {
          return { 
            ...f, 
            count: f.count - 1,
            unread: emailToMove.read ? f.unread : f.unread - 1
          }
        }
        return f
      }))
      
      return true
    } catch (err) {
      setError('Error al mover el email')
      console.error('Error moving email:', err)
      return false
    }
  }

  // Add label
  const addLabel = async (id: string, label: string): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update labels
      setEmails(prev => prev.map(email => {
        if (email.id === id) {
          const currentLabels = email.labels || []
          if (!currentLabels.includes(label)) {
            return { ...email, labels: [...currentLabels, label] }
          }
        }
        return email
      }))
      
      return true
    } catch (err) {
      setError('Error al añadir etiqueta')
      console.error('Error adding label:', err)
      return false
    }
  }

  // Remove label
  const removeLabel = async (id: string, label: string): Promise<boolean> => {
    try {
      // In a real implementation, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Update labels
      setEmails(prev => prev.map(email => {
        if (email.id === id && email.labels) {
          return { 
            ...email, 
            labels: email.labels.filter(l => l !== label) 
          }
        }
        return email
      }))
      
      return true
    } catch (err) {
      setError('Error al eliminar etiqueta')
      console.error('Error removing label:', err)
      return false
    }
  }

  // Refresh emails
  const refreshEmails = async (): Promise<void> => {
    setLastRefresh(Date.now())
  }

  // Función para obtener plantillas disponibles
  const getTemplates = async (provider?: EmailProvider): Promise<any[]> => {
    try {
      setLoading(true)
      
      // Usar el proveedor especificado o el predeterminado
      const emailProvider = provider || EMAIL_CONFIG.defaultProvider
      
      // Crear el adaptador para el proveedor
      const emailService = EmailServiceFactory.createAdapter(emailProvider)
      
      // Verificar si el adaptador soporta plantillas
      if (typeof emailService.getTemplates === 'function') {
        return await emailService.getTemplates()
      }
      
      return []
    } catch (error) {
      console.error('Error al obtener plantillas:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    emails,
    folders,
    labels,
    currentFolder,
    currentEmail,
    loading,
    error,
    sendEmail,
    saveAsDraft,
    deleteEmail,
    markAsRead,
    markAsStarred,
    moveToFolder,
    addLabel,
    removeLabel,
    setCurrentFolder,
    setCurrentEmail,
    refreshEmails,
    getTemplates
  }
}

export default useEmail 