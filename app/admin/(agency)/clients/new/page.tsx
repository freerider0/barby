import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ArrowLeft, Save, UserPlus } from "lucide-react";
import { ReactNode } from "react";

interface LabelProps {
  htmlFor: string;
  children: ReactNode;
}

function Label({ htmlFor, children }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      {children}
    </label>
  );
}

export default function NewClientPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/clients" passHref>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Nuevo Cliente</h1>
        </div>
        <Button className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          <span>Guardar Cliente</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
              <CardDescription>
                Introduce los datos del nuevo cliente. Los campos marcados con * son obligatorios.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="personal">Datos Personales</TabsTrigger>
                  <TabsTrigger value="contact">Contacto</TabsTrigger>
                  <TabsTrigger value="additional">Información Adicional</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="clientType">Tipo de Cliente *</Label>
                      <Select defaultValue="owner">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="owner">Propietario</SelectItem>
                          <SelectItem value="agent">Agente</SelectItem>
                          <SelectItem value="buyer">Comprador</SelectItem>
                          <SelectItem value="tenant">Inquilino</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Selecciona el tipo de relación con el cliente
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select defaultValue="active">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                          <SelectItem value="lead">Potencial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo *</Label>
                    <Input id="name" placeholder="Nombre y apellidos" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="documentType">Tipo de Documento</Label>
                      <Select defaultValue="dni">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dni">DNI</SelectItem>
                          <SelectItem value="nie">NIE</SelectItem>
                          <SelectItem value="passport">Pasaporte</SelectItem>
                          <SelectItem value="other">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documentNumber">Número de Documento</Label>
                      <Input id="documentNumber" placeholder="Ej: 12345678A" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                    <Input id="birthdate" type="date" />
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" placeholder="ejemplo@correo.com" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input id="phone" placeholder="Ej: 612345678" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternativePhone">Teléfono Alternativo</Label>
                      <Input id="alternativePhone" placeholder="Ej: 612345678" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Dirección</Label>
                    <Input id="address" placeholder="Calle, número, piso..." />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" placeholder="Ej: Barcelona" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input id="postalCode" placeholder="Ej: 08001" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="province">Provincia</Label>
                      <Input id="province" placeholder="Ej: Barcelona" />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="source">Origen del Cliente</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el origen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Página Web</SelectItem>
                        <SelectItem value="referral">Referido</SelectItem>
                        <SelectItem value="social">Redes Sociales</SelectItem>
                        <SelectItem value="portal">Portal Inmobiliario</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="assignedAgent">Agente Asignado</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un agente" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent1">Ana Martínez</SelectItem>
                        <SelectItem value="agent2">Carlos Rodríguez</SelectItem>
                        <SelectItem value="agent3">Laura Sánchez</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Información adicional sobre el cliente..." 
                      className="min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="contactPreferences">Preferencias de Contacto</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="contactEmail" />
                        <label
                          htmlFor="contactEmail"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Email
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="contactPhone" />
                        <label
                          htmlFor="contactPhone"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Teléfono
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="contactWhatsapp" />
                        <label
                          htmlFor="contactWhatsapp"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          WhatsApp
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
              <CardDescription>
                Información general del cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center p-6">
                <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center">
                  <UserPlus className="h-12 w-12 text-muted-foreground" />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Tipo de Cliente</h3>
                  <p>Propietario</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Estado</h3>
                  <p>Activo</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground">Fecha de Creación</h3>
                  <p>{new Date().toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" type="submit">
                Guardar Cliente
              </Button>
              <Button variant="outline" className="w-full">
                Cancelar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 