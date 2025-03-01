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
import { WhatsAppChat } from "@/components/chat/whatsapp-chat";
import { UnifiedChat } from "@/components/chat/unified-chat";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ChatPage() {
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
                  <BreadcrumbPage>Centro de Comunicaciones</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Centro de Comunicaciones</h2>
          </div>
          
          <div className="grid gap-4">
            <p className="text-muted-foreground">
              Gestiona todas tus conversaciones con clientes desde un solo lugar. Integración con WhatsApp, Messenger, Instagram y Email.
            </p>
            
            <Tabs defaultValue="unified" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="unified">Chat Unificado</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              </TabsList>
              
              <TabsContent value="unified" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Chat Unificado</CardTitle>
                    <CardDescription>
                      Gestiona todas tus conversaciones desde un solo lugar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UnifiedChat />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>WhatsApp</CardTitle>
                    <CardDescription>
                      Conecta con tus clientes a través de WhatsApp
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <WhatsAppChat />
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


