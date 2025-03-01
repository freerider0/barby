"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  Home, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart4
} from "lucide-react";

// Status colors
const statusColors = {
  completed: "green",
  processing: "blue",
  pending: "yellow",
  submitted: "purple",
};

// Status labels
const statusLabels = {
  completed: "Completado",
  processing: "En Proceso",
  pending: "Pendiente",
  submitted: "Enviado",
};

export default function CertificateDetail({ certificate, open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("details");

  // Mock certificate data for preview
  const mockCertificate = certificate || {
    id: "cert-001",
    type: "energy",
    reference: "CEE-2023-001",
    status: "completed",
    createdAt: "15/10/2023",
    updatedAt: "20/10/2023",
    address: "Calle Mayor 10, 3º B",
    city: "Madrid",
    postalCode: "28001",
    province: "Madrid",
    propertyType: "apartment",
    constructionYear: "1995",
    area: "85",
    // Energy specific data
    energyRating: "C",
    co2Rating: "D",
    primaryEnergyConsumption: "120.5",
    co2Emissions: "25.3",
    heatingSystem: "gas",
    coolingSystem: "electric",
    renewableEnergy: true,
    renewableEnergyType: "Paneles solares",
    windows: "double",
    facadeInsulation: true,
    roofInsulation: false,
    // Owner data
    ownerName: "Juan Pérez García",
    ownerEmail: "juan.perez@example.com",
    ownerPhone: "600123456",
    // Processing data
    processingSteps: [
      { name: "Solicitud recibida", completed: true, date: "15/10/2023" },
      { name: "Datos verificados", completed: true, date: "16/10/2023" },
      { name: "Cálculos realizados", completed: true, date: "18/10/2023" },
      { name: "Certificado generado", completed: true, date: "19/10/2023" },
      { name: "Enviado a administración", completed: true, date: "20/10/2023" },
      { name: "Aprobado por administración", completed: false, date: null },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {mockCertificate.type === "energy" ? "Certificado Energético" : "Cédula de Habitabilidad"}
              </DialogTitle>
              <DialogDescription className="text-base">
                Ref: {mockCertificate.reference}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={`bg-${statusColors[mockCertificate.status]}-50 text-${statusColors[mockCertificate.status]}-700 border-${statusColors[mockCertificate.status]}-200 px-3 py-1`}>
              {statusLabels[mockCertificate.status]}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="status">Estado del Trámite</TabsTrigger>
            {mockCertificate.type === "energy" && (
              <TabsTrigger value="energy">Datos Energéticos</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Datos del Inmueble
              </h3>
              <Separator className="my-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Dirección</div>
                  <div className="font-medium">{mockCertificate.address}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Localidad</div>
                  <div className="font-medium">{mockCertificate.city}, {mockCertificate.province}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Código Postal</div>
                  <div className="font-medium">{mockCertificate.postalCode}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Tipo de Inmueble</div>
                  <div className="font-medium">
                    {mockCertificate.propertyType === "apartment" ? "Piso / Apartamento" : 
                     mockCertificate.propertyType === "house" ? "Casa / Chalet" : 
                     mockCertificate.propertyType === "commercial" ? "Local Comercial" : "Otro"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Año de Construcción</div>
                  <div className="font-medium">{mockCertificate.constructionYear}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Superficie</div>
                  <div className="font-medium">{mockCertificate.area} m²</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <User className="h-5 w-5 mr-2" />
                Datos del Propietario
              </h3>
              <Separator className="my-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Nombre</div>
                  <div className="font-medium">{mockCertificate.ownerName}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{mockCertificate.ownerEmail}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Teléfono</div>
                  <div className="font-medium">{mockCertificate.ownerPhone}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Fechas
              </h3>
              <Separator className="my-3" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Fecha de Solicitud</div>
                  <div className="font-medium">{mockCertificate.createdAt}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Última Actualización</div>
                  <div className="font-medium">{mockCertificate.updatedAt}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Descargar PDF</span>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Estado del Trámite
              </h3>
              <Separator className="my-3" />

              <div className="space-y-4">
                {mockCertificate.processingSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="mr-4 mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{step.name}</div>
                      {step.date && (
                        <div className="text-sm text-muted-foreground">{step.date}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted p-4 rounded-md mt-6">
                <div className="font-medium">Tiempo estimado de finalización</div>
                <div className="text-sm text-muted-foreground mt-1">
                  El trámite se encuentra en proceso. Tiempo estimado restante: 5-7 días hábiles.
                </div>
              </div>
            </div>
          </TabsContent>

          {mockCertificate.type === "energy" && (
            <TabsContent value="energy" className="mt-6">
              <div className="space-y-6">
                <h3 className="text-lg font-medium flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" />
                  Calificación Energética
                </h3>
                <Separator className="my-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Eficiencia Energética</CardTitle>
                      <CardDescription>Consumo de energía primaria</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-4">
                        <div className={`text-5xl font-bold w-20 h-20 rounded-full flex items-center justify-center bg-${getRatingColor(mockCertificate.energyRating)}-100 text-${getRatingColor(mockCertificate.energyRating)}-700 border-4 border-${getRatingColor(mockCertificate.energyRating)}-500`}>
                          {mockCertificate.energyRating}
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-sm text-muted-foreground">Consumo</div>
                        <div className="font-medium">{mockCertificate.primaryEnergyConsumption} kWh/m²·año</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Emisiones CO₂</CardTitle>
                      <CardDescription>Emisiones de dióxido de carbono</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center py-4">
                        <div className={`text-5xl font-bold w-20 h-20 rounded-full flex items-center justify-center bg-${getRatingColor(mockCertificate.co2Rating)}-100 text-${getRatingColor(mockCertificate.co2Rating)}-700 border-4 border-${getRatingColor(mockCertificate.co2Rating)}-500`}>
                          {mockCertificate.co2Rating}
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-sm text-muted-foreground">Emisiones</div>
                        <div className="font-medium">{mockCertificate.co2Emissions} kgCO₂/m²·año</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mt-6">Características Energéticas</h3>
                  <Separator className="my-3" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Sistema de Calefacción</div>
                      <div className="font-medium">
                        {mockCertificate.heatingSystem === "gas" ? "Gas Natural" : 
                         mockCertificate.heatingSystem === "electric" ? "Eléctrica" : 
                         mockCertificate.heatingSystem === "diesel" ? "Gasóleo" : 
                         mockCertificate.heatingSystem === "none" ? "Sin calefacción" : "Otro"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Sistema de Refrigeración</div>
                      <div className="font-medium">
                        {mockCertificate.coolingSystem === "electric" ? "Aire acondicionado" : 
                         mockCertificate.coolingSystem === "central" ? "Centralizado" : 
                         mockCertificate.coolingSystem === "none" ? "Sin refrigeración" : "Otro"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Tipo de Ventanas</div>
                      <div className="font-medium">
                        {mockCertificate.windows === "single" ? "Cristal Simple" : 
                         mockCertificate.windows === "double" ? "Doble Acristalamiento" : 
                         mockCertificate.windows === "triple" ? "Triple Acristalamiento" : "Desconocido"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Energías Renovables</div>
                      <div className="font-medium">
                        {mockCertificate.renewableEnergy ? `Sí (${mockCertificate.renewableEnergyType})` : "No"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Aislamiento en Fachada</div>
                      <div className="font-medium">
                        {mockCertificate.facadeInsulation ? "Sí" : "No"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Aislamiento en Cubierta</div>
                      <div className="font-medium">
                        {mockCertificate.roofInsulation ? "Sí" : "No"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-md mt-6">
                  <div className="font-medium">Recomendaciones de mejora</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Mejorar el aislamiento térmico de la cubierta</li>
                      <li>Sustituir las ventanas por unas de mayor eficiencia térmica</li>
                      <li>Instalar sistemas de energía renovable</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get color based on energy rating
function getRatingColor(rating) {
  switch (rating) {
    case 'A':
      return 'green';
    case 'B':
      return 'emerald';
    case 'C':
      return 'lime';
    case 'D':
      return 'yellow';
    case 'E':
      return 'amber';
    case 'F':
      return 'orange';
    case 'G':
      return 'red';
    default:
      return 'gray';
  }
} 