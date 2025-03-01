'use client';

import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Filter, 
  Download,
  Instagram,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChatPlatform, CHANNEL_INFO } from "@/components/chat/config";

// Datos de ejemplo para el historial
const historyData = [
  {
    id: 1,
    contact: "Juan Pérez",
    type: ChatPlatform.WHATSAPP,
    content: "Consulta sobre certificado energético",
    date: "Hoy, 10:30 AM",
    status: "Respondido",
  },
  {
    id: 2,
    contact: "María García",
    type: ChatPlatform.EMAIL,
    content: "Envío de documentación para cédula de habitabilidad",
    date: "Ayer, 15:45 PM",
    status: "Pendiente",
  },
  {
    id: 3,
    contact: "Carlos Rodríguez",
    type: ChatPlatform.WHATSAPP,
    content: "Confirmación de visita para fotografía",
    date: "Ayer, 12:20 PM",
    status: "Respondido",
  },
  {
    id: 4,
    contact: "Ana Martínez",
    type: "call",
    content: "Llamada sobre presupuesto de certificado",
    date: "22/02/2024, 09:15 AM",
    status: "Completado",
  },
  {
    id: 5,
    contact: "Pedro Sánchez",
    type: ChatPlatform.MESSENGER,
    content: "Consulta sobre plazos de entrega",
    date: "21/02/2024, 16:30 PM",
    status: "Respondido",
  },
  {
    id: 6,
    contact: "Laura Gómez",
    type: ChatPlatform.INSTAGRAM,
    content: "Solicitud de información sobre servicios",
    date: "20/02/2024, 11:45 AM",
    status: "Pendiente",
  },
  {
    id: 7,
    contact: "Miguel Fernández",
    type: "call",
    content: "Llamada de seguimiento",
    date: "19/02/2024, 14:20 PM",
    status: "Completado",
  },
  {
    id: 8,
    contact: "Sofía López",
    type: ChatPlatform.EMAIL,
    content: "Confirmación de recepción de documentos",
    date: "18/02/2024, 10:05 AM",
    status: "Respondido",
  },
];

// Función para obtener el icono según el tipo de comunicación
const getCommunicationIcon = (type: string) => {
  switch (type) {
    case ChatPlatform.WHATSAPP:
    case ChatPlatform.MESSENGER:
      return <MessageSquare className="h-4 w-4" />;
    case ChatPlatform.EMAIL:
      return <Mail className="h-4 w-4" />;
    case "call":
      return <Phone className="h-4 w-4" />;
    case ChatPlatform.INSTAGRAM:
      return <Instagram className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

// Función para obtener el color según el tipo de comunicación
const getCommunicationColor = (type: string) => {
  if (type === "call") return "#6366f1"; // Indigo
  return type in CHANNEL_INFO ? CHANNEL_INFO[type as ChatPlatform].color : "#6366f1";
};

// Función para obtener la variante de badge según el estado
const getStatusVariant = (status: string) => {
  switch (status) {
    case "Respondido":
      return "default";
    case "Pendiente":
      return "secondary";
    case "Completado":
      return "outline";
    default:
      return "default";
  }
};

export default function HistoryPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/admin">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/chat">
                    Comunicaciones
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Historial</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Historial de Comunicaciones</h2>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Filtros</CardTitle>
                <CardDescription>
                  Filtra el historial de comunicaciones por diferentes criterios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input placeholder="Buscar por cliente o contenido" />
                  </div>
                  <div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de comunicación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="call">Llamada</SelectItem>
                        <SelectItem value="messenger">Messenger</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="respondido">Respondido</SelectItem>
                        <SelectItem value="pendiente">Pendiente</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Input type="date" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Historial</CardTitle>
                <CardDescription>
                  Registro de todas las comunicaciones con clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Contenido</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{item.contact[0]}</AvatarFallback>
                            </Avatar>
                            <span>{item.contact}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div 
                            className="flex items-center justify-center h-8 w-8 rounded-full" 
                            style={{ backgroundColor: getCommunicationColor(item.type) }}
                          >
                            <div className="text-white">
                              {getCommunicationIcon(item.type)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                          {item.content}
                        </TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(item.status)}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 