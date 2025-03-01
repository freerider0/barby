'use client'

import React, { useState, useEffect } from 'react'
import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Paperclip, 
  Send, 
  Save, 
  Trash, 
  X, 
  ChevronDown,
  Underline,
  Code,
  Quote
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { EMAIL_CONFIG } from './config'

interface EmailEditorProps {
  onSend?: (emailData: EmailData) => void
  onSave?: (emailData: EmailData) => void
  onDiscard?: () => void
  initialData?: Partial<EmailData>
  mode?: 'compose' | 'reply' | 'forward'
}

export interface EmailData {
  to: string[]
  cc: string[]
  bcc: string[]
  subject: string
  content: string
  attachments: File[]
  from: string
  replyTo?: string
  originalEmail?: any
}

export const EmailEditor: React.FC<EmailEditorProps> = ({
  onSend,
  onSave,
  onDiscard,
  initialData = {},
  mode = 'compose'
}) => {
  const [emailData, setEmailData] = useState<EmailData>({
    to: initialData.to || [],
    cc: initialData.cc || [],
    bcc: initialData.bcc || [],
    subject: initialData.subject || '',
    content: initialData.content || '',
    attachments: initialData.attachments || [],
    from: initialData.from || EMAIL_CONFIG.defaultFrom || '',
    replyTo: initialData.replyTo,
    originalEmail: initialData.originalEmail
  })

  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [toInput, setToInput] = useState('')
  const [ccInput, setCcInput] = useState('')
  const [bccInput, setBccInput] = useState('')
  const [attachmentError, setAttachmentError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 underline cursor-pointer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-md max-w-full',
        },
      }),
    ],
    content: emailData.content,
    onUpdate: ({ editor }) => {
      setEmailData(prev => ({
        ...prev,
        content: editor.getHTML()
      }))
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] max-w-none p-4',
      },
    },
  })

  useEffect(() => {
    if (editor && initialData.content) {
      editor.commands.setContent(initialData.content)
    }
  }, [editor, initialData.content])

  const handleSend = () => {
    if (onSend) {
      onSend(emailData)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(emailData)
    }
  }

  const handleDiscard = () => {
    if (onDiscard) {
      onDiscard()
    }
  }

  const addRecipient = (type: 'to' | 'cc' | 'bcc', value: string) => {
    if (!value.trim()) return
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value.trim())) {
      // Could show an error here
      return
    }
    
    setEmailData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }))
    
    // Clear the input
    if (type === 'to') setToInput('')
    if (type === 'cc') setCcInput('')
    if (type === 'bcc') setBccInput('')
  }

  const removeRecipient = (type: 'to' | 'cc' | 'bcc', index: number) => {
    setEmailData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newAttachments = Array.from(files)
    const totalSize = [...emailData.attachments, ...newAttachments].reduce(
      (sum, file) => sum + file.size, 0
    )

    // Check if total size exceeds limit (25MB)
    if (totalSize > 25 * 1024 * 1024) {
      setAttachmentError('Total attachment size exceeds 25MB limit')
      return
    }

    setAttachmentError(null)
    setEmailData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments]
    }))
  }

  const removeAttachment = (index: number) => {
    setEmailData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
    setAttachmentError(null)
  }

  if (!editor) {
    return <div>Loading editor...</div>
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle>
          {mode === 'compose' ? 'Nuevo Email' : mode === 'reply' ? 'Responder' : 'Reenviar'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From field */}
        <div className="flex items-center space-x-2">
          <span className="w-16 text-sm font-medium">De:</span>
          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {emailData.from}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {EMAIL_CONFIG.availableFromAddresses?.map((address) => (
                  <DropdownMenuItem 
                    key={address}
                    onClick={() => setEmailData(prev => ({ ...prev, from: address }))}
                  >
                    {address}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* To field with chips */}
        <div className="flex items-start space-x-2">
          <span className="w-16 text-sm font-medium pt-2">Para:</span>
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
              {emailData.to.map((recipient, index) => (
                <div key={index} className="flex items-center bg-muted px-2 py-1 rounded-md">
                  <span className="text-sm">{recipient}</span>
                  <button 
                    onClick={() => removeRecipient('to', index)}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <input
                type="text"
                value={toInput}
                onChange={(e) => setToInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addRecipient('to', toInput)
                  }
                  if (e.key === ',' || e.key === ';') {
                    e.preventDefault()
                    addRecipient('to', toInput)
                  }
                }}
                onBlur={() => addRecipient('to', toInput)}
                placeholder={emailData.to.length === 0 ? "Añadir destinatarios" : ""}
                className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
              />
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setShowCc(!showCc)
              if (!showCc) setShowBcc(true)
            }}
            className="text-xs"
          >
            {showCc ? 'Ocultar CC/BCC' : 'Mostrar CC/BCC'}
          </Button>
        </div>

        {/* CC field */}
        {showCc && (
          <div className="flex items-start space-x-2">
            <span className="w-16 text-sm font-medium pt-2">CC:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {emailData.cc.map((recipient, index) => (
                  <div key={index} className="flex items-center bg-muted px-2 py-1 rounded-md">
                    <span className="text-sm">{recipient}</span>
                    <button 
                      onClick={() => removeRecipient('cc', index)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={ccInput}
                  onChange={(e) => setCcInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRecipient('cc', ccInput)
                    }
                    if (e.key === ',' || e.key === ';') {
                      e.preventDefault()
                      addRecipient('cc', ccInput)
                    }
                  }}
                  onBlur={() => addRecipient('cc', ccInput)}
                  placeholder={emailData.cc.length === 0 ? "Añadir destinatarios en copia" : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* BCC field */}
        {showCc && showBcc && (
          <div className="flex items-start space-x-2">
            <span className="w-16 text-sm font-medium pt-2">BCC:</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                {emailData.bcc.map((recipient, index) => (
                  <div key={index} className="flex items-center bg-muted px-2 py-1 rounded-md">
                    <span className="text-sm">{recipient}</span>
                    <button 
                      onClick={() => removeRecipient('bcc', index)}
                      className="ml-1 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={bccInput}
                  onChange={(e) => setBccInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addRecipient('bcc', bccInput)
                    }
                    if (e.key === ',' || e.key === ';') {
                      e.preventDefault()
                      addRecipient('bcc', bccInput)
                    }
                  }}
                  onBlur={() => addRecipient('bcc', bccInput)}
                  placeholder={emailData.bcc.length === 0 ? "Añadir destinatarios en copia oculta" : ""}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Subject field */}
        <div className="flex items-center space-x-2">
          <span className="w-16 text-sm font-medium">Asunto:</span>
          <Input 
            value={emailData.subject}
            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="Asunto del email"
            className="flex-1"
          />
        </div>

        <Separator />

        {/* Editor toolbar */}
        <div className="flex flex-wrap gap-1 pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={editor.isActive('code') ? 'bg-muted' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL')
              if (url) {
                editor.chain().focus().setLink({ href: url }).run()
              }
            }}
            className={editor.isActive('link') ? 'bg-muted' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const url = window.prompt('URL de la imagen')
              if (url) {
                editor.chain().focus().setImage({ src: url }).run()
              }
            }}
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={editor.isActive({ textAlign: 'left' }) ? 'bg-muted' : ''}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={editor.isActive({ textAlign: 'center' }) ? 'bg-muted' : ''}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={editor.isActive({ textAlign: 'right' }) ? 'bg-muted' : ''}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor content */}
        <div className="border rounded-md overflow-hidden">
          <EditorContent editor={editor} />
        </div>

        {/* Attachments */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="outline" size="sm" asChild>
              <label>
                <Paperclip className="h-4 w-4 mr-2" />
                Adjuntar archivo
                <input 
                  type="file" 
                  multiple 
                  className="hidden" 
                  onChange={handleAttachmentChange}
                />
              </label>
            </Button>
            <span className="text-xs text-muted-foreground">
              {emailData.attachments.length > 0 
                ? `${emailData.attachments.length} archivo(s) adjunto(s)` 
                : 'Sin archivos adjuntos'}
            </span>
          </div>
          
          {attachmentError && (
            <p className="text-sm text-destructive mb-2">{attachmentError}</p>
          )}
          
          {emailData.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {emailData.attachments.map((file, index) => (
                <div key={index} className="flex items-center bg-muted px-3 py-1 rounded-md">
                  <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({(file.size / 1024).toFixed(0)} KB)
                  </span>
                  <button 
                    onClick={() => removeAttachment(index)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleDiscard}>
          <Trash className="h-4 w-4 mr-2" />
          Descartar
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Guardar borrador
          </Button>
          <Button onClick={handleSend}>
            <Send className="h-4 w-4 mr-2" />
            Enviar
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default EmailEditor 