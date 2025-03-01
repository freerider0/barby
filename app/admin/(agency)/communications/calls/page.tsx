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
import { Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function CallsPage() {
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
                  <BreadcrumbPage>Llamadas</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Llamadas</h2>
            <Button>
              <PhoneCall className="mr-2 h-4 w-4" />
              Nueva llamada
            </Button>
          </div>
          
          <div className="grid gap-4">
            <Tabs defaultValue="recientes" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="recientes">Recientes</TabsTrigger>
                <TabsTrigger value="contactos">Contactos</TabsTrigger>
                <TabsTrigger value="programadas">Programadas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recientes" className="space-y-4">
                <Card className="h-[600px] flex items-center justify-center">
                  <CardContent className="text-center p-6">
                    <Phone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-medium mb-2">Módulo de Llamadas</h3>
                    <p className="text-muted-foreground mb-4">
                      Esta funcionalidad estará disponible próximamente. Podrás realizar y recibir llamadas directamente desde la plataforma.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>En desarrollo</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contactos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contactos frecuentes</CardTitle>
                    <CardDescription>
                      Tus contactos más frecuentes aparecerán aquí para un acceso rápido
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex flex-col items-center p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                          <Avatar className="h-16 w-16 mb-2">
                            <AvatarFallback>
                              <User className="h-8 w-8" />
                            </AvatarFallback>
                          </Avatar>
                          <p className="font-medium text-center">Contacto {i}</p>
                          <p className="text-xs text-muted-foreground">Cliente</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="programadas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Llamadas programadas</CardTitle>
                    <CardDescription>
                      Programa llamadas con tus clientes y recibe recordatorios
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>C{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Cliente {i}</p>
                              <p className="text-sm text-muted-foreground">Mañana, 10:00 AM</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="icon">
                              <Clock className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon">
                              <PhoneCall className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
} 