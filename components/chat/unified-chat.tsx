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
import { Checkbox } from '@/components/ui/checkbox';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  Image as ImageIcon, 
  Paperclip, 
  Mic, 
  QrCode,
  Mail,
  MessageCircle,
  Instagram,
  Filter,
  Search,
  CheckSquare,
} from 'lucide-react';
import QRCode from 'qrcode';
import { ChatPlatform, CHANNEL_INFO } from './config';

// Tipos para los mensajes y contactos
interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOutgoing: boolean;
  platform: ChatPlatform;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  platforms: ChatPlatform[];
}

// Componente para mostrar un mensaje individual
const ChatMessage = ({ message }: { message: Message }) => {
  // Obtener información del canal
  const channelInfo = CHANNEL_INFO[message.platform];

  return (
    <div className={`flex ${message.isOutgoing ? 'justify-end' : 'justify-start'} mb-4`}>
      {!message.isOutgoing && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback>{message.sender[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col">
        <div
          className={`px-4 py-2 rounded-lg max-w-[70%] ${
            message.isOutgoing
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}
          style={{
            borderLeft: !message.isOutgoing ? `4px solid ${channelInfo.color}` : undefined,
            borderRight: message.isOutgoing ? `4px solid ${channelInfo.color}` : undefined,
          }}
        >
          <p className="text-sm">{message.text}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {message.platform === ChatPlatform.WHATSAPP && (
                      <MessageCircle size={12} color={channelInfo.color} />
                    )}
                    {message.platform === ChatPlatform.MESSENGER && (
                      <MessageCircle size={12} color={channelInfo.color} />
                    )}
                    {message.platform === ChatPlatform.INSTAGRAM && (
                      <Instagram size={12} color={channelInfo.color} />
                    )}
                    {message.platform === ChatPlatform.EMAIL && (
                      <Mail size={12} color={channelInfo.color} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Enviado por {channelInfo.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {message.isOutgoing && message.status && (
          <div className="text-xs text-right mt-1 text-muted-foreground">
            {message.status === 'sent' && 'Enviado'}
            {message.status === 'delivered' && 'Entregado'}
            {message.status === 'read' && 'Leído'}
            {message.status === 'failed' && 'Error al enviar'}
          </div>
        )}
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
        <div className="flex gap-1 mt-1">
          {contact.platforms.map(platform => (
            <TooltipProvider key={platform}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: CHANNEL_INFO[platform].color }}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Disponible en {CHANNEL_INFO[platform].name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      {contact.unreadCount && contact.unreadCount > 0 && (
        <Badge variant="default" className="rounded-full h-5 min-w-5 flex items-center justify-center">
          {contact.unreadCount}
        </Badge>
      )}
    </div>
  );
};

// Componente para seleccionar canales
const ChannelSelector = ({ 
  selectedChannels, 
  onChannelToggle,
  availableChannels
}: { 
  selectedChannels: ChatPlatform[]; 
  onChannelToggle: (channel: ChatPlatform) => void;
  availableChannels: ChatPlatform[];
}) => {
  return (
    <div className="flex items-center gap-2 px-2">
      {availableChannels.map(channel => (
        <TooltipProvider key={channel}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={selectedChannels.includes(channel) ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                onClick={() => onChannelToggle(channel)}
                style={{ 
                  backgroundColor: selectedChannels.includes(channel) ? CHANNEL_INFO[channel].color : undefined,
                  borderColor: !selectedChannels.includes(channel) ? CHANNEL_INFO[channel].color : undefined,
                }}
              >
                {channel === ChatPlatform.WHATSAPP && <MessageCircle className="h-4 w-4" />}
                {channel === ChatPlatform.MESSENGER && <MessageCircle className="h-4 w-4" />}
                {channel === ChatPlatform.INSTAGRAM && <Instagram className="h-4 w-4" />}
                {channel === ChatPlatform.EMAIL && <Mail className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{selectedChannels.includes(channel) ? `Desactivar ${CHANNEL_INFO[channel].name}` : `Activar ${CHANNEL_INFO[channel].name}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
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

// Componente principal de chat unificado
export const UnifiedChat = () => {
  // Estados
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [selectedChannels, setSelectedChannels] = useState<ChatPlatform[]>([ChatPlatform.WHATSAPP]);
  const [filterChannels, setFilterChannels] = useState<ChatPlatform[]>([]);
  const [showChannelFilter, setShowChannelFilter] = useState(false);
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
        platforms: [ChatPlatform.WHATSAPP, ChatPlatform.EMAIL],
      },
      {
        id: '2',
        name: 'María García',
        lastMessage: 'Te envié los documentos',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
        platforms: [ChatPlatform.WHATSAPP, ChatPlatform.MESSENGER, ChatPlatform.EMAIL],
      },
      {
        id: '3',
        name: 'Carlos Rodríguez',
        lastMessage: 'Nos vemos mañana',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
        platforms: [ChatPlatform.INSTAGRAM, ChatPlatform.EMAIL],
      },
      {
        id: '4',
        name: 'Ana Martínez',
        lastMessage: 'Gracias por la información',
        lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5),
        platforms: [ChatPlatform.WHATSAPP, ChatPlatform.MESSENGER, ChatPlatform.INSTAGRAM],
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
        platform: ChatPlatform.WHATSAPP,
      },
      {
        id: '2',
        text: 'Bien, gracias. ¿Y tú?',
        sender: 'Yo',
        timestamp: new Date(Date.now() - 1000 * 60 * 9),
        isOutgoing: true,
        platform: ChatPlatform.WHATSAPP,
        status: 'read',
      },
      {
        id: '3',
        text: 'Todo bien. Quería preguntarte sobre el certificado energético',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        isOutgoing: false,
        platform: ChatPlatform.WHATSAPP,
      },
      {
        id: '4',
        text: 'Claro, dime qué necesitas saber',
        sender: 'Yo',
        timestamp: new Date(Date.now() - 1000 * 60 * 7),
        isOutgoing: true,
        platform: ChatPlatform.WHATSAPP,
        status: 'read',
      },
      {
        id: '5',
        text: '¿Cuánto tiempo tarda en emitirse?',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 6),
        isOutgoing: false,
        platform: ChatPlatform.WHATSAPP,
      },
      {
        id: '6',
        text: 'Te acabo de enviar un email con toda la información sobre los certificados energéticos',
        sender: 'Yo',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        isOutgoing: true,
        platform: ChatPlatform.EMAIL,
        status: 'delivered',
      },
      {
        id: '7',
        text: 'Gracias, lo revisaré ahora mismo',
        sender: 'Juan Pérez',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        isOutgoing: false,
        platform: ChatPlatform.EMAIL,
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
    if (!message.trim() || !activeContact || selectedChannels.length === 0) return;

    // Enviar mensaje a todos los canales seleccionados
    selectedChannels.forEach(platform => {
      const newMessage: Message = {
        id: `${Date.now()}-${platform}`,
        text: message,
        sender: 'Yo',
        timestamp: new Date(),
        isOutgoing: true,
        platform,
        status: 'sent',
      };

      setMessages(prev => [...prev, newMessage]);

      // Simular respuesta después de 1-3 segundos
      setTimeout(() => {
        // Actualizar estado del mensaje a entregado
        setMessages(prev => 
          prev.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        );

        // Simular respuesta solo para WhatsApp y Messenger
        if (platform === ChatPlatform.WHATSAPP || platform === ChatPlatform.MESSENGER) {
          setTimeout(() => {
            const responseMessage: Message = {
              id: `${Date.now() + 1}-${platform}`,
              text: `Respuesta automática por ${CHANNEL_INFO[platform].name} a: ${message}`,
              sender: activeContact.name,
              timestamp: new Date(),
              isOutgoing: false,
              platform,
            };

            setMessages(prev => [...prev, responseMessage]);

            // Actualizar estado del mensaje a leído
            setMessages(prev => 
              prev.map(msg => 
                msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
              )
            );
          }, 1000);
        }
      }, 1000 + Math.random() * 2000);
    });

    setMessage('');
  };

  // Manejador para alternar canales seleccionados
  const handleChannelToggle = (channel: ChatPlatform) => {
    setSelectedChannels(prev => {
      if (prev.includes(channel)) {
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  // Manejador para alternar filtros de canales
  const handleFilterToggle = (channel: ChatPlatform) => {
    setFilterChannels(prev => {
      if (prev.includes(channel)) {
        return prev.filter(c => c !== channel);
      } else {
        return [...prev, channel];
      }
    });
  };

  // Filtrar mensajes según los canales seleccionados
  const filteredMessages = filterChannels.length > 0
    ? messages.filter(msg => filterChannels.includes(msg.platform))
    : messages;

  // Obtener canales disponibles para el contacto activo
  const availableChannels = activeContact?.platforms || [];

  return (
    <Card className="w-full h-[700px] max-h-[80vh]">
      <CardHeader className="p-4 pb-0">
        <CardTitle>Chat Unificado</CardTitle>
        <CardDescription>
          Gestiona todas tus conversaciones desde un solo lugar
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-full">
        <div className="h-full flex flex-col">
          <div className="h-full flex">
            {!isConnected ? (
              <div className="w-full h-full flex items-center justify-center">
                <QRCodeDisplay qrCode={qrCode} />
              </div>
            ) : (
              <>
                {/* Lista de contactos */}
                <div className="w-1/3 border-r h-full">
                  <div className="p-3">
                    <Input placeholder="Buscar contactos" className="w-full" />
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="p-2">
                      {contacts.map((contact) => (
                        <ContactItem
                          key={contact.id}
                          contact={contact}
                          isActive={activeContact?.id === contact.id}
                          onClick={() => {
                            setActiveContact(contact);
                            // Actualizar canales seleccionados según los disponibles para el contacto
                            setSelectedChannels(prev => 
                              prev.filter(channel => contact.platforms.includes(channel))
                            );
                            if (selectedChannels.length === 0 && contact.platforms.length > 0) {
                              setSelectedChannels([contact.platforms[0]]);
                            }
                          }}
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
                            <div className="flex gap-1">
                              {activeContact.platforms.map(platform => (
                                <TooltipProvider key={platform}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div 
                                        className="w-2 h-2 rounded-full" 
                                        style={{ backgroundColor: CHANNEL_INFO[platform].color }}
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Disponible en {CHANNEL_INFO[platform].name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => setShowChannelFilter(!showChannelFilter)}
                                >
                                  <Filter className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Filtrar mensajes por canal</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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

                      {/* Filtro de canales */}
                      {showChannelFilter && (
                        <div className="p-2 border-b flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Filtrar por:</span>
                          {Object.values(ChatPlatform).map(platform => (
                            <TooltipProvider key={platform}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant={filterChannels.includes(platform) ? "default" : "outline"}
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => handleFilterToggle(platform)}
                                    style={{ 
                                      backgroundColor: filterChannels.includes(platform) ? CHANNEL_INFO[platform].color : undefined,
                                      borderColor: !filterChannels.includes(platform) ? CHANNEL_INFO[platform].color : undefined,
                                    }}
                                  >
                                    {CHANNEL_INFO[platform].name}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{filterChannels.includes(platform) ? `Ocultar mensajes de ${CHANNEL_INFO[platform].name}` : `Mostrar solo mensajes de ${CHANNEL_INFO[platform].name}`}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                          {filterChannels.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setFilterChannels([])}
                            >
                              Limpiar filtros
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Mensajes */}
                      <ScrollArea className="flex-1 p-4">
                        {filteredMessages.map((msg) => (
                          <ChatMessage key={msg.id} message={msg} />
                        ))}
                        <div ref={messagesEndRef} />
                      </ScrollArea>

                      {/* Selector de canales */}
                      <div className="border-t py-2">
                        <div className="flex items-center justify-between px-3">
                          <span className="text-sm text-muted-foreground">Enviar a través de:</span>
                          <ChannelSelector 
                            selectedChannels={selectedChannels} 
                            onChannelToggle={handleChannelToggle}
                            availableChannels={availableChannels}
                          />
                        </div>
                      </div>

                      {/* Entrada de mensaje */}
                      <div className="p-3 border-t flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <ImageIcon className="h-5 w-5" />
                        </Button>
                        <Input
                          placeholder={
                            selectedChannels.length === 0 
                              ? "Selecciona al menos un canal para enviar mensajes" 
                              : `Escribe un mensaje para enviar por ${selectedChannels.map(c => CHANNEL_INFO[c].name).join(', ')}`
                          }
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                          disabled={selectedChannels.length === 0}
                        />
                        <Button variant="ghost" size="icon">
                          <Mic className="h-5 w-5" />
                        </Button>
                        <Button 
                          onClick={handleSendMessage} 
                          disabled={!message.trim() || selectedChannels.length === 0}
                        >
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 