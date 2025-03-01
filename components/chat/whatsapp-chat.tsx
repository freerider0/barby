'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Send, Phone, Video, MoreVertical, Image, Paperclip, Mic, QrCode } from 'lucide-react';
import QRCode from 'qrcode';

// Tipos para los mensajes y contactos
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOutgoing: boolean;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

// Componente para mostrar un mensaje individual
const ChatMessage = ({ message }: { message: Message }) => {
  return (
    <div className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isOutgoing && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`px-4 py-2 rounded-lg max-w-[70%] ${
          message.isOutgoing
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs opacity-70 text-right mt-1">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {message.isOutgoing && (
        <Avatar className="h-8 w-8 ml-2">
          <AvatarFallback>YO</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

// Componente para mostrar un contacto en la lista
const ContactItem = ({ 
  contact, 
  isActive, 
  onClick 
}: { 
  contact: Contact; 
  isActive: boolean; 
  onClick: () => void;
}) => {
  return (
    <div
      className={`flex items-center gap-3 p-3 cursor-pointer rounded-lg ${
        isActive ? 'bg-muted' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <Avatar>
        <AvatarFallback>{contact.name[0]}</AvatarFallback>
        {contact.avatar && <AvatarImage src={contact.avatar} />}
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate">{contact.name}</p>
          {contact.lastMessageTime && (
            <span className="text-xs text-muted-foreground">
              {new Date(contact.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        {contact.lastMessage && (
          <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
        )}
      </div>
      {contact.unreadCount && contact.unreadCount > 0 && (
        <Badge variant="default" className="rounded-full h-5 min-w-5 flex items-center justify-center">
          {contact.unreadCount}
        </Badge>
      )}
    </div>
  );
};

// Componente para mostrar el código QR
const QRCodeDisplay = ({ qrCode }: { qrCode: string | null }) => {
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (qrCode) {
      QRCode.toDataURL(qrCode)
        .then((url: string) => {
          setQrImageUrl(url);
        })
        .catch((err: Error) => {
          console.error('Error al generar el código QR:', err);
        });
    } else {
      setQrImageUrl(null);
    }
  }, [qrCode]);

  if (!qrCode) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <QrCode className="h-16 w-16 mb-4 text-muted-foreground" />
        <p className="text-center text-muted-foreground">
          Esperando código QR para conectar con WhatsApp...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="mb-4">
        {qrImageUrl && (
          <img src={qrImageUrl} alt="WhatsApp QR Code" className="w-64 h-64" />
        )}
      </div>
      <p className="text-center">
        Escanea este código QR con tu teléfono para conectar WhatsApp
      </p>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Abre WhatsApp en tu teléfono, ve a Configuración &gt; Dispositivos vinculados &gt; Vincular un dispositivo
      </p>
    </div>
  );
};

// Componente principal de chat
export const WhatsAppChat = () => {
  // Estados
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Efecto para cargar datos iniciales (simulados)
  useEffect(() => {
    // Simulación de contactos
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'Juan Pérez',
        lastMessage: 'Hola, ¿cómo estás?',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
        unreadCount: 2,
      },
      {
        id: '2',
        name: 'María García',
        lastMessage: 'Te envié los documentos',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      },
      {
        id: '3',
        name: 'Carlos Rodríguez',
        lastMessage: 'Nos vemos mañana',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      },
      {
        id: '4',
        name: 'Ana Martínez',
        lastMessage: 'Gracias por la información',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
      },
    ];

    setContacts(mockContacts);
    setActiveContact(mockContacts[0]);

    // Simulación de mensajes para el primer contacto
    const mockMessages: Message[] = [
      {
        id: '1',
        text: 'Hola, ¿cómo estás?',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        isOutgoing: false,
      },
      {
        id: '2',
        text: 'Bien, gracias. ¿Y tú?',
        sender: 'Yo',
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        isOutgoing: true,
      },
      {
        id: '3',
        text: 'Todo bien. Quería preguntarte sobre el certificado energético',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        isOutgoing: false,
      },
      {
        id: '4',
        text: 'Claro, dime qué necesitas saber',
        sender: 'Yo',
        timestamp: new Date(Date.now() - 1000 * 60 * 7),
        isOutgoing: true,
      },
      {
        id: '5',
        text: '¿Cuánto tiempo tarda en emitirse?',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isOutgoing: false,
      },
    ];

    setMessages(mockMessages);

    // Aquí se conectaría con el backend para obtener el estado de la conexión
    // y registrar los listeners para eventos de WhatsApp
    const connectToWhatsApp = async () => {
      try {
        // Simular conexión
        setTimeout(() => {
          setQrCode('https://example.com/connect-whatsapp');
          
          // Simular conexión exitosa después de 5 segundos
          setTimeout(() => {
            setIsConnected(true);
            setQrCode(null);
          }, 5000);
        }, 2000);
      } catch (error) {
        console.error('Error al conectar con WhatsApp:', error);
      }
    };

    connectToWhatsApp();

    // Limpiar al desmontar
    return () => {
      // Limpiar listeners
    };
  }, []);

  // Efecto para hacer scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejador para enviar mensajes
  const handleSendMessage = () => {
    if (!message.trim() || !activeContact) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'Yo',
      timestamp: new Date(),
      isOutgoing: true,
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simular respuesta después de 1 segundo
    setTimeout(() => {
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Respuesta automática a: ${message}`,
        sender: activeContact.name,
        timestamp: new Date(),
        isOutgoing: false,
      };

      setMessages((prev) => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <Card className="w-full h-[700px] max-h-[80vh]">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Chat Integrado</CardTitle>
        <CardDescription>
          Gestiona tus conversaciones desde un solo lugar
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <Tabs defaultValue="whatsapp" className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList className="w-full">
              <TabsTrigger value="whatsapp" className="flex-1">WhatsApp</TabsTrigger>
              <TabsTrigger value="messenger" className="flex-1">Messenger</TabsTrigger>
              <TabsTrigger value="instagram" className="flex-1">Instagram</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="whatsapp" className="flex-1 flex mt-0 data-[state=active]:flex">
            {!isConnected ? (
              <div className="w-full h-full flex items-center justify-center">
                <QRCodeDisplay qrCode={qrCode} />
              </div>
            ) : (
              <>
                {/* Lista de contactos */}
                <div className="w-1/3 border-r h-full">
                  <div className="p-3">
                    <Input placeholder="Buscar o empezar un nuevo chat" className="w-full" />
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="p-2">
                      {contacts.map((contact) => (
                        <ContactItem
                          key={contact.id}
                          contact={contact}
                          isActive={activeContact?.id === contact.id}
                          onClick={() => setActiveContact(contact)}
                        />
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Área de chat */}
                <div className="w-2/3 flex flex-col h-full">
                  {activeContact ? (
                    <>
                      {/* Cabecera del chat */}
                      <div className="p-3 border-b flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>{activeContact.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{activeContact.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {isConnected ? 'En línea' : 'Desconectado'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Phone className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Video className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      {/* Mensajes */}
                      <ScrollArea className="flex-1 p-4">
                        {messages.map((msg) => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                      </ScrollArea>

                      {/* Entrada de mensaje */}
                      <div className="p-3 border-t flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Image className="h-5 w-5" />
                        </Button>
                        <Input
                          placeholder="Escribe un mensaje"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button variant="ghost" size="icon">
                          <Mic className="h-5 w-5" />
                        </Button>
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-5 w-5" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">
                        Selecciona un chat para comenzar
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="messenger" className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Messenger (Próximamente)</h3>
              <p className="text-muted-foreground">
                La integración con Facebook Messenger estará disponible pronto.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="flex-1 flex items-center justify-center">
            <div className="text-center p-8">
              <h3 className="text-lg font-medium mb-2">Instagram (Próximamente)</h3>
              <p className="text-muted-foreground">
                La integración con Instagram Direct estará disponible pronto.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 