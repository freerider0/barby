'use client';

import { useState } from 'react';
import { UnifiedChat } from '@/components/chat/unified-chat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  Home, 
  MessageSquare, 
  Calendar, 
  Users, 
  FileText, 
  Settings,
  ChevronRight,
  Search,
  Bell,
  User
} from 'lucide-react';

export default function DemoPage() {
  const [showChat, setShowChat] = useState(false);
  
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold flex items-center">
            <Building2 className="mr-2 h-5 w-5" />
            CEE Inmobiliaria
          </h2>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            <Button variant="ghost" className="justify-start">
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="justify-start">
              <Building2 className="mr-2 h-5 w-5" />
              Propiedades
            </Button>
            <Button variant="secondary" className="justify-start">
              <MessageSquare className="mr-2 h-5 w-5" />
              Comunicaciones
            </Button>
            <Button variant="ghost" className="justify-start">
              <Calendar className="mr-2 h-5 w-5" />
              Calendario
            </Button>
            <Button variant="ghost" className="justify-start">
              <Users className="mr-2 h-5 w-5" />
              Clientes
            </Button>
            <Button variant="ghost" className="justify-start">
              <FileText className="mr-2 h-5 w-5" />
              Documentos
            </Button>
            <Button variant="ghost" className="justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Configuración
            </Button>
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <User className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Ana García</p>
              <p className="text-xs text-muted-foreground">Agente Inmobiliario</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="border-b">
          <div className="flex h-16 items-center px-4 gap-4">
            <h1 className="text-xl font-semibold">Centro de Comunicaciones</h1>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Mensajes pendientes</CardTitle>
                <CardDescription>Total de mensajes sin responder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 desde ayer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conversaciones activas</CardTitle>
                <CardDescription>Clientes con los que has hablado hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">-1 desde ayer</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Tiempo de respuesta</CardTitle>
                <CardDescription>Tiempo promedio de respuesta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5m 23s</div>
                <p className="text-xs text-muted-foreground">-12s desde ayer</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Chat Unificado</CardTitle>
                <CardDescription>
                  Gestiona todas tus conversaciones con clientes desde un solo lugar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UnifiedChat />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
      
      {/* Chat flotante (versión móvil) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        {showChat ? (
          <Card className="w-[350px] h-[500px]">
            <CardHeader className="p-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Chat</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowChat(false)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <UnifiedChat />
            </CardContent>
          </Card>
        ) : (
          <Button 
            size="lg" 
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setShowChat(true)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
} 