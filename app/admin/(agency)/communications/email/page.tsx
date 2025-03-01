'use client';

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { 
  Mail, 
  Search, 
  Star, 
  Inbox, 
  Send, 
  File, 
  Trash2, 
  RefreshCw, 
  Plus, 
  Tag, 
  Paperclip,
  ArrowLeft,
  FileText
} from 'lucide-react'
import { useEmail, Email } from '@/components/email/use-email'
import { EmailEditor, EmailData } from '@/components/email/email-editor'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function EmailPage() {
  const { 
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
    refreshEmails
  } = useEmail()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [showCompose, setShowCompose] = useState(false)
  const [composeMode, setComposeMode] = useState<'compose' | 'reply' | 'forward'>('compose')
  const [initialEmailData, setInitialEmailData] = useState<Partial<EmailData>>({})

  // Filter emails by current folder and search query
  const filteredEmails = emails.filter(email => {
    const matchesFolder = email.folder === currentFolder
    
    if (!searchQuery) return matchesFolder
    
    const query = searchQuery.toLowerCase()
    return (
      matchesFolder && (
        email.subject.toLowerCase().includes(query) ||
        email.from.toLowerCase().includes(query) ||
        email.to.some(to => to.toLowerCase().includes(query)) ||
        (email.content && email.content.toLowerCase().includes(query))
      )
    )
  })

  const handleSelectEmail = (id: string) => {
    const email = emails.find(e => e.id === id)
    if (email) {
      setCurrentEmail(email)
      if (!email.read) {
        markAsRead(id, true)
      }
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedEmails(prev => 
      prev.includes(id) 
        ? prev.filter(emailId => emailId !== id) 
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectedEmails.length === filteredEmails.length) {
      setSelectedEmails([])
    } else {
      setSelectedEmails(filteredEmails.map(email => email.id))
    }
  }

  const handleCompose = () => {
    setComposeMode('compose')
    setInitialEmailData({})
    setShowCompose(true)
    setCurrentEmail(null)
  }

  const handleReply = (email: Email) => {
    setComposeMode('reply')
    setInitialEmailData({
      to: [email.from],
      subject: `Re: ${email.subject}`,
      content: `<p><br/><br/><hr/><blockquote>${email.content}</blockquote></p>`,
      replyTo: email.id,
      originalEmail: email
    })
    setShowCompose(true)
  }

  const handleForward = (email: Email) => {
    setComposeMode('forward')
    setInitialEmailData({
      subject: `Fwd: ${email.subject}`,
      content: `<p><br/><br/><hr/><blockquote>---------- Mensaje reenviado ----------<br/>
      De: ${email.from}<br/>
      Fecha: ${format(email.date, 'PPP', { locale: es })}<br/>
      Asunto: ${email.subject}<br/>
      Para: ${email.to.join(', ')}<br/><br/>
      ${email.content}</blockquote></p>`,
      attachments: email.attachments ? [] : undefined, // We would need to handle attachments properly
      originalEmail: email
    })
    setShowCompose(true)
  }

  const handleSendEmail = async (emailData: EmailData) => {
    const success = await sendEmail(emailData)
    if (success) {
      setShowCompose(false)
      setCurrentFolder('sent')
    }
  }

  const handleSaveDraft = async (emailData: EmailData) => {
    const success = await saveAsDraft(emailData)
    if (success) {
      setShowCompose(false)
      setCurrentFolder('drafts')
    }
  }

  const handleDiscardEmail = () => {
    setShowCompose(false)
  }

  const handleRefresh = () => {
    refreshEmails()
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const isToday = date.getDate() === now.getDate() && 
                    date.getMonth() === now.getMonth() && 
                    date.getFullYear() === now.getFullYear()
    
    if (isToday) {
      return format(date, 'HH:mm')
    } else {
      return format(date, 'dd MMM', { locale: es })
    }
  }

  const getEmailExcerpt = (content: string, maxLength = 100) => {
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '')
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header con botón de nuevo email */}
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h1 className="text-lg font-medium">Email</h1>
        <Button onClick={handleCompose} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Email
        </Button>
      </div>
      
      {/* Main content */}
      <div className="flex-1 grid grid-cols-12 h-[calc(100vh-8rem)]">
        {/* Email folders sidebar */}
        <div className="col-span-2 border-r p-4 space-y-4">
          <Button 
            variant="default" 
            className="w-full mb-4" 
            size="sm"
            onClick={handleCompose}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Email
          </Button>
          
          <div className="space-y-1">
            {folders.map(folder => (
              <Button
                key={folder.id}
                variant={currentFolder === folder.id ? "secondary" : "ghost"}
                className="w-full justify-start px-2 py-1.5 text-left"
                size="sm"
                onClick={() => {
                  setCurrentFolder(folder.id)
                  setCurrentEmail(null)
                  setSelectedEmails([])
                }}
              >
                <div className="flex items-center min-w-0 w-full">
                  <div className="flex-shrink-0 mr-2">
                    {folder.id === 'inbox' && <Inbox className="h-4 w-4" />}
                    {folder.id === 'sent' && <Send className="h-4 w-4" />}
                    {folder.id === 'drafts' && <File className="h-4 w-4" />}
                    {folder.id === 'trash' && <Trash2 className="h-4 w-4" />}
                  </div>
                  <span className="text-sm truncate flex-1">{folder.name}</span>
                  {folder.unread > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0 flex-shrink-0">
                      {folder.unread}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <h3 className="text-sm font-medium mb-2 px-2">Etiquetas</h3>
            {labels.map(label => (
              <div key={label.id} className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-muted/50 cursor-pointer">
                <div 
                  className="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0" 
                  style={{ backgroundColor: label.color }}
                />
                <span className="text-sm truncate">{label.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        {showCompose ? (
          // Compose view takes full width
          <div className="col-span-10 p-4 h-full overflow-auto">
            <div className="mb-4 flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowCompose(false)}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-medium">
                {composeMode === 'compose' ? 'Nuevo Email' : 
                 composeMode === 'reply' ? 'Responder' : 'Reenviar'}
              </h2>
            </div>
            <EmailEditor 
              onSend={handleSendEmail}
              onSave={handleSaveDraft}
              onDiscard={handleDiscardEmail}
              initialData={initialEmailData}
              mode={composeMode}
            />
          </div>
        ) : (
          <>
            {/* Email list column */}
            <div className={`${currentEmail ? 'col-span-4' : 'col-span-10'} flex flex-col h-full border-r`}>
              {/* Email list toolbar */}
              <div className="border-b p-2 flex items-center gap-2 bg-muted/10">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    checked={selectedEmails.length > 0 && selectedEmails.length === filteredEmails.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={handleRefresh}
                    className="h-8 w-8"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="ml-auto flex items-center">
                  <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Buscar emails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 h-8 bg-background"
                    />
                  </div>
                </div>
              </div>
              
              {/* Email list */}
              {loading ? (
                <div className="flex items-center justify-center h-full p-4">
                  <p>Cargando emails...</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Mail className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-base font-medium mb-1">No hay emails</h3>
                  <p className="text-muted-foreground mb-4 max-w-md text-sm">
                    {searchQuery 
                      ? 'No se encontraron emails que coincidan con tu búsqueda.' 
                      : 'No hay emails en esta carpeta.'}
                  </p>
                  {searchQuery && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSearchQuery('')}
                    >
                      Limpiar búsqueda
                    </Button>
                  )}
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="divide-y">
                    {filteredEmails.map(email => (
                      <div 
                        key={email.id}
                        className={`flex items-start p-3 hover:bg-muted/30 cursor-pointer transition-colors ${
                          !email.read ? 'bg-muted/20 font-medium' : ''
                        } ${currentEmail?.id === email.id ? 'bg-muted/40' : ''}`}
                        onClick={() => handleSelectEmail(email.id)}
                      >
                        <div className="flex items-center mr-2 space-x-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                          <Checkbox 
                            checked={selectedEmails.includes(email.id)}
                            onCheckedChange={() => handleToggleSelect(email.id)}
                          />
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => markAsStarred(email.id, !email.starred)}
                          >
                            <Star 
                              className={`h-4 w-4 ${email.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                            />
                          </Button>
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <div className="font-medium truncate text-sm">
                              {currentFolder === 'sent' ? `Para: ${email.to[0]}` : email.from}
                            </div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                              {formatDate(email.date)}
                            </div>
                          </div>
                          
                          <div className="text-sm font-medium truncate">{email.subject}</div>
                          
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {getEmailExcerpt(email.content, 120)}
                          </div>
                          
                          <div className="flex items-center mt-1">
                            {email.attachments && email.attachments.length > 0 && (
                              <div className="flex items-center text-xs text-muted-foreground mr-2">
                                <Paperclip className="h-3 w-3 mr-1" />
                                {email.attachments.length}
                              </div>
                            )}
                            
                            {email.labels && email.labels.length > 0 && (
                              <div className="flex items-center space-x-1">
                                {email.labels.map(labelId => {
                                  const label = labels.find(l => l.id === labelId)
                                  if (!label) return null
                                  return (
                                    <div 
                                      key={label.id} 
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: label.color }}
                                    />
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
            
            {/* Email content column - only shown when an email is selected */}
            {currentEmail && (
              <div className="col-span-6 flex flex-col h-full bg-background">
                {/* Email view toolbar */}
                <div className="border-b p-2 flex items-center bg-muted/10">
                  {/* On mobile, show back button */}
                  <div className="md:hidden">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setCurrentEmail(null)}
                      className="h-8 w-8 mr-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-1 ml-auto">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => markAsStarred(currentEmail.id, !currentEmail.starred)}
                      className="h-8 w-8"
                    >
                      <Star 
                        className={`h-4 w-4 ${currentEmail.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                      />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleReply(currentEmail)}
                      className="px-2"
                    >
                      Responder
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleForward(currentEmail)}
                      className="px-2"
                    >
                      Reenviar
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => deleteEmail(currentEmail.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Email content */}
                <ScrollArea className="flex-1 p-0">
                  <div className="max-w-3xl mx-auto p-4">
                    <div className="mb-6">
                      <h1 className="text-xl font-bold mb-4">{currentEmail.subject}</h1>
                      <div className="flex items-start mb-4 bg-muted/5 p-3 rounded-lg">
                        <Avatar className="mr-3 h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="text-base">
                            {currentEmail.from.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 min-w-0">
                          <div className="font-medium text-sm">{currentEmail.from}</div>
                          <div className="text-xs text-muted-foreground">
                            Para: {currentEmail.to.join(', ')}
                            {currentEmail.cc && currentEmail.cc.length > 0 && (
                              <div className="mt-1">CC: {currentEmail.cc.join(', ')}</div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {format(currentEmail.date, 'PPPp', { locale: es })}
                          </div>
                        </div>
                      </div>
                      
                      {currentEmail.labels && currentEmail.labels.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {currentEmail.labels.map(labelId => {
                            const label = labels.find(l => l.id === labelId)
                            if (!label) return null
                            return (
                              <Badge 
                                key={label.id} 
                                style={{ 
                                  backgroundColor: label.color,
                                  color: 'white'
                                }}
                                className="px-2 py-0 text-xs"
                              >
                                {label.name}
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                      
                      {currentEmail.attachments && currentEmail.attachments.length > 0 && (
                        <div className="mb-4 p-3 border rounded-lg bg-muted/5">
                          <div className="flex items-center mb-2">
                            <Paperclip className="h-4 w-4 mr-2" />
                            <span className="font-medium text-sm">
                              {currentEmail.attachments.length} adjunto(s)
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {currentEmail.attachments.map((attachment, index) => (
                              <div 
                                key={index} 
                                className="flex items-center p-2 border rounded-md bg-background hover:bg-muted/30 transition-colors cursor-pointer"
                              >
                                <FileText className="h-4 w-4 mr-2 text-primary" />
                                <div>
                                  <div className="text-xs font-medium">{attachment.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {Math.round(attachment.size / 1024)} KB
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div 
                      className="prose prose-sm max-w-none prose-headings:font-semibold prose-p:text-sm prose-p:leading-relaxed prose-a:text-primary"
                      dangerouslySetInnerHTML={{ __html: currentEmail.content }}
                    />
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
} 