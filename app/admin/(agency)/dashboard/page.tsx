'use client'

import { AppSidebar } from "@/components/layout/app-sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Building, 
  CreditCard, 
  FileCheck, 
  Home, 
  TrendingUp, 
  Users, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  MoreHorizontal,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts"

// Sample data for charts
const certificateData = [
  { name: 'Ene', energeticos: 40, habitabilidad: 24 },
  { name: 'Feb', energeticos: 30, habitabilidad: 13 },
  { name: 'Mar', energeticos: 20, habitabilidad: 28 },
  { name: 'Abr', energeticos: 27, habitabilidad: 39 },
  { name: 'May', energeticos: 18, habitabilidad: 48 },
  { name: 'Jun', energeticos: 23, habitabilidad: 38 },
  { name: 'Jul', energeticos: 34, habitabilidad: 43 },
]

const revenueData = [
  { name: 'Ene', ingresos: 4000 },
  { name: 'Feb', ingresos: 3000 },
  { name: 'Mar', ingresos: 2000 },
  { name: 'Abr', ingresos: 2780 },
  { name: 'May', ingresos: 1890 },
  { name: 'Jun', ingresos: 2390 },
  { name: 'Jul', ingresos: 3490 },
]

const serviceDistribution = [
  { name: 'Certificados Energéticos', value: 400 },
  { name: 'Cédulas de Habitabilidad', value: 300 },
  { name: 'Fotografía Profesional', value: 300 },
  { name: 'Tours Virtuales', value: 200 },
  { name: 'Planos', value: 100 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const recentActivity = [
  { 
    id: 1, 
    type: 'certificate', 
    title: 'Certificado Energético', 
    address: 'Calle Mayor 23, Barcelona', 
    status: 'completed', 
    date: '2 horas atrás',
    client: 'María López'
  },
  { 
    id: 2, 
    type: 'service', 
    title: 'Fotografía Profesional', 
    address: 'Avenida Diagonal 145, Barcelona', 
    status: 'pending', 
    date: '5 horas atrás',
    client: 'Juan Rodríguez'
  },
  { 
    id: 3, 
    type: 'certificate', 
    title: 'Cédula de Habitabilidad', 
    address: 'Paseo de Gracia 78, Barcelona', 
    status: 'in-progress', 
    date: '1 día atrás',
    client: 'Carlos Martínez'
  },
  { 
    id: 4, 
    type: 'service', 
    title: 'Tour Virtual Matterport', 
    address: 'Rambla Catalunya 45, Barcelona', 
    status: 'completed', 
    date: '2 días atrás',
    client: 'Ana García'
  },
]

export default function Page() {
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
                  <BreadcrumbPage>Resumen</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <CalendarDays className="mr-2 h-4 w-4" />
                Últimos 30 días
              </Button>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Certificado
              </Button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Certificados Totales
                </CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    +12.5%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos Mensuales
                </CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€4,550.00</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    +7.2%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Propiedades
                </CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-emerald-500 flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4" />
                    +3.1%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Clientes Activos
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-rose-500 flex items-center">
                    <ArrowDownRight className="mr-1 h-4 w-4" />
                    -2.5%
                  </span>{" "}
                  desde el mes pasado
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Charts */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="analytics">Análisis</TabsTrigger>
              <TabsTrigger value="reports">Informes</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Certificados Emitidos</CardTitle>
                    <CardDescription>
                      Comparativa mensual de certificados energéticos y cédulas de habitabilidad
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={certificateData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="energeticos" name="Certificados Energéticos" fill="#0088FE" />
                        <Bar dataKey="habitabilidad" name="Cédulas de Habitabilidad" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Distribución de Servicios</CardTitle>
                    <CardDescription>
                      Distribución de servicios por tipo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center">
                    <ResponsiveContainer width="100%" height={350}>
                      <PieChart>
                        <Pie
                          data={serviceDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {serviceDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Ingresos</CardTitle>
                    <CardDescription>
                      Evolución de ingresos mensuales
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area type="monotone" dataKey="ingresos" stroke="#8884d8" fillOpacity={1} fill="url(#colorIngresos)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>
                      Últimas actividades y certificados
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-3">
                          <div className="rounded-full bg-primary/10 p-2">
                            {activity.type === 'certificate' ? (
                              <FileCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Building className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <Badge variant={
                                activity.status === 'completed' ? 'default' : 
                                activity.status === 'pending' ? 'secondary' : 
                                'outline'
                              }>
                                {activity.status === 'completed' ? 'Completado' : 
                                 activity.status === 'pending' ? 'Pendiente' : 
                                 'En Progreso'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{activity.address}</p>
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback>{activity.client.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs">{activity.client}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{activity.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Avanzado</CardTitle>
                  <CardDescription>
                    Análisis detallado de rendimiento y métricas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Contenido de análisis avanzado (próximamente)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informes</CardTitle>
                  <CardDescription>
                    Informes detallados y exportables
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Sección de informes (próximamente)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                  <CardDescription>
                    Centro de notificaciones y alertas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px] flex items-center justify-center border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Centro de notificaciones (próximamente)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
