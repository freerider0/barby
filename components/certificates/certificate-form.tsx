"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Form schema for energy certificate
const energyCertificateSchema = z.object({
  type: z.literal("energy"),
  propertyType: z.enum(["apartment", "house", "commercial", "other"]),
  address: z.string().min(5, "La dirección es obligatoria"),
  city: z.string().min(2, "La ciudad es obligatoria"),
  postalCode: z.string().min(5, "El código postal es obligatorio"),
  province: z.string().min(2, "La provincia es obligatoria"),
  constructionYear: z.string().regex(/^\d{4}$/, "Año de construcción inválido"),
  area: z.string().min(1, "La superficie es obligatoria"),
  floors: z.string().min(1, "El número de plantas es obligatorio"),
  heatingSystem: z.enum(["none", "electric", "gas", "diesel", "other"]),
  coolingSystem: z.enum(["none", "electric", "central", "other"]),
  renewableEnergy: z.boolean().default(false),
  renewableEnergyType: z.string().optional(),
  windows: z.enum(["single", "double", "triple"]),
  facadeInsulation: z.boolean().default(false),
  roofInsulation: z.boolean().default(false),
  ownerName: z.string().min(2, "El nombre del propietario es obligatorio"),
  ownerEmail: z.string().email("Email inválido"),
  ownerPhone: z.string().min(9, "Teléfono inválido"),
  notes: z.string().optional(),
});

// Form schema for habitability certificate
const habitabilityCertificateSchema = z.object({
  type: z.literal("habitability"),
  propertyType: z.enum(["apartment", "house", "commercial", "other"]),
  address: z.string().min(5, "La dirección es obligatoria"),
  city: z.string().min(2, "La ciudad es obligatoria"),
  postalCode: z.string().min(5, "El código postal es obligatorio"),
  province: z.string().min(2, "La provincia es obligatoria"),
  constructionYear: z.string().regex(/^\d{4}$/, "Año de construcción inválido"),
  area: z.string().min(1, "La superficie es obligatoria"),
  rooms: z.string().min(1, "El número de habitaciones es obligatorio"),
  bathrooms: z.string().min(1, "El número de baños es obligatorio"),
  hasWaterSupply: z.boolean().default(true),
  hasElectricity: z.boolean().default(true),
  hasSewage: z.boolean().default(true),
  hasVentilation: z.boolean().default(true),
  hasNaturalLight: z.boolean().default(true),
  ceilingHeight: z.string().min(1, "La altura del techo es obligatoria"),
  ownerName: z.string().min(2, "El nombre del propietario es obligatorio"),
  ownerEmail: z.string().email("Email inválido"),
  ownerPhone: z.string().min(9, "Teléfono inválido"),
  notes: z.string().optional(),
});

// Combined schema with discriminated union
const certificateSchema = z.discriminatedUnion("type", [
  energyCertificateSchema,
  habitabilityCertificateSchema,
]);

// Upselling services schema
const upsellingServicesSchema = z.object({
  photography: z.boolean().default(false),
  matterport: z.boolean().default(false),
  floorPlan: z.boolean().default(false),
  arRenovation: z.boolean().default(false),
});

// Esquema para la facturación de agencias
const agencyBillingSchema = z.object({
  requestInvoice: z.boolean().default(false),
  invoiceAmount: z.string().optional(),
  clientName: z.string().optional(),
  clientEmail: z.string().email("Email inválido").optional(),
  clientPhone: z.string().optional(),
  clientAddress: z.string().optional(),
  clientTaxId: z.string().optional(),
  notes: z.string().optional(),
});

// Define types based on the schemas
type EnergyCertificate = z.infer<typeof energyCertificateSchema>;
type HabilitabilityCertificate = z.infer<typeof habitabilityCertificateSchema>;
type Certificate = z.infer<typeof certificateSchema>;
type UpsellingServices = z.infer<typeof upsellingServicesSchema>;
type AgencyBilling = z.infer<typeof agencyBillingSchema>;

// Define service prices
const SERVICE_PRICES = {
  photography: 99,
  matterport: 149,
  floorPlan: 79,
  arRenovation: 199,
};

// Define props for the component
interface CertificateFormProps {
  onSubmit: (data: Certificate & { 
    upsellingServices?: UpsellingServices,
    agencyBilling?: AgencyBilling 
  }) => void;
  onCancel: () => void;
  initialData?: Partial<Certificate>;
  isAgency?: boolean; // Indica si el usuario es una agencia
}

export default function CertificateForm({ onSubmit, onCancel, initialData = {}, isAgency = false }: CertificateFormProps) {
  const [certificateType, setCertificateType] = useState<"energy" | "habitability">(
    initialData.type || "energy"
  );

  // Initialize form with the energy certificate schema
  const form = useForm<Certificate & { 
    upsellingServices?: UpsellingServices,
    agencyBilling?: AgencyBilling 
  }>({
    resolver: zodResolver(
      certificateType === "energy" ? energyCertificateSchema : habitabilityCertificateSchema
    ) as any, // Using any to handle the conditional schema
    defaultValues: {
      type: certificateType === "energy" ? "energy" : "habitability",
      propertyType: "apartment",
      address: "",
      city: "",
      postalCode: "",
      province: "",
      constructionYear: "",
      area: "",
      // Energy specific defaults
      ...(certificateType === "energy" ? {
        floors: "",
        heatingSystem: "none",
        coolingSystem: "none",
        renewableEnergy: false,
        renewableEnergyType: "",
        windows: "single",
        facadeInsulation: false,
        roofInsulation: false,
      } : {}),
      // Habitability specific defaults
      ...(certificateType === "habitability" ? {
        rooms: "",
        bathrooms: "",
        hasWaterSupply: true,
        hasElectricity: true,
        hasSewage: true,
        hasVentilation: true,
        hasNaturalLight: true,
        ceilingHeight: "",
      } : {}),
      // Common fields
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      notes: "",
      // Upselling services
      upsellingServices: {
        photography: false,
        matterport: false,
        floorPlan: false,
        arRenovation: false,
      },
      // Agency billing defaults
      agencyBilling: {
        requestInvoice: false,
        invoiceAmount: "",
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        clientAddress: "",
        clientTaxId: "",
        notes: "",
      },
      // Override with any initialData provided
      ...initialData,
    } as any, // Using any here to handle the conditional fields
  });

  // Handle tab change
  const handleTabChange = (value: string) => {
    if (value === "energy" || value === "habitability") {
      setCertificateType(value);
      form.reset({
        ...form.getValues(),
        type: value,
      } as any); // Using any here to handle the conditional fields
    }
  };

  // Calculate total price of selected services
  const calculateTotalPrice = () => {
    const upsellingServices = form.watch("upsellingServices");
    if (!upsellingServices) return 0;
    
    let total = 0;
    if (upsellingServices.photography) total += SERVICE_PRICES.photography;
    if (upsellingServices.matterport) total += SERVICE_PRICES.matterport;
    if (upsellingServices.floorPlan) total += SERVICE_PRICES.floorPlan;
    if (upsellingServices.arRenovation) total += SERVICE_PRICES.arRenovation;
    
    return total;
  };

  // Handle form submission
  const handleSubmit = (data: Certificate & { 
    upsellingServices?: UpsellingServices,
    agencyBilling?: AgencyBilling 
  }) => {
    toast.success("Certificado creado", {
      description: "El certificado ha sido creado correctamente",
    });
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Nuevo Certificado</CardTitle>
        <CardDescription>
          Introduce los datos necesarios para generar el certificado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={certificateType} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="energy">Certificado Energético</TabsTrigger>
            <TabsTrigger value="habitability">Cédula de Habitabilidad</TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Datos del Inmueble</h3>
                  <Separator className="my-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Inmueble</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona el tipo de inmueble" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="apartment">Piso / Apartamento</SelectItem>
                            <SelectItem value="house">Casa / Chalet</SelectItem>
                            <SelectItem value="commercial">Local Comercial</SelectItem>
                            <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="constructionYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Año de Construcción</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 1995" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Calle, número, piso, puerta..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Barcelona" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="province"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provincia</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Barcelona" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 08001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Superficie (m²)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 85" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Energy Certificate specific fields */}
                {certificateType === "energy" && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium">Datos Energéticos</h3>
                      <Separator className="my-4" />
                    </div>

                    <FormField
                      control={form.control}
                      name="floors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Plantas</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="heatingSystem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sistema de Calefacción</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona el sistema" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Sin calefacción</SelectItem>
                                <SelectItem value="electric">Eléctrica</SelectItem>
                                <SelectItem value="gas">Gas Natural</SelectItem>
                                <SelectItem value="diesel">Gasóleo</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="coolingSystem"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sistema de Refrigeración</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona el sistema" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="none">Sin refrigeración</SelectItem>
                                <SelectItem value="electric">Aire acondicionado</SelectItem>
                                <SelectItem value="central">Centralizado</SelectItem>
                                <SelectItem value="other">Otro</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="windows"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Ventanas</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Cristal Simple</SelectItem>
                              <SelectItem value="double">Doble Acristalamiento</SelectItem>
                              <SelectItem value="triple">Triple Acristalamiento</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="facadeInsulation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Aislamiento en Fachada</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con aislamiento térmico en la fachada
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="roofInsulation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Aislamiento en Cubierta</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con aislamiento térmico en la cubierta
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="renewableEnergy"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Energías Renovables</FormLabel>
                            <FormDescription>
                              El inmueble cuenta con sistemas de energía renovable
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch("renewableEnergy") && (
                      <FormField
                        control={form.control}
                        name="renewableEnergyType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Energía Renovable</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: Paneles solares, geotermia..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                {/* Habitability Certificate specific fields */}
                {certificateType === "habitability" && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium">Datos de Habitabilidad</h3>
                      <Separator className="my-4" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={"rooms" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Habitaciones</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 3" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={"bathrooms" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Baños</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 2" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={"ceilingHeight" as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Altura de Techos (m)</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 2.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={"hasWaterSupply" as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Suministro de Agua</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con suministro de agua potable
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={"hasElectricity" as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Suministro Eléctrico</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con instalación eléctrica
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name={"hasSewage" as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Sistema de Evacuación</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con sistema de evacuación de aguas residuales
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={"hasVentilation" as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Ventilación</FormLabel>
                              <FormDescription>
                                El inmueble cuenta con ventilación adecuada
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={"hasNaturalLight" as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Luz Natural</FormLabel>
                            <FormDescription>
                              El inmueble cuenta con iluminación natural adecuada
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div>
                  <h3 className="text-lg font-medium">Datos del Propietario</h3>
                  <Separator className="my-4" />
                </div>

                <FormField
                  control={form.control}
                  name="ownerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre y apellidos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="ownerEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="ejemplo@correo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 600123456" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas Adicionales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Información adicional relevante para el certificado..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Agency Billing Section - Only visible for agencies */}
                {isAgency && (
                  <>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Facturación al Cliente</h3>
                      </div>
                      <Separator className="my-4" />
                    </div>

                    <div className="space-y-6">
                      <p className="text-sm text-muted-foreground">
                        Como agencia, puedes solicitar que emitamos una factura directamente a tu cliente por el importe que indiques.
                        Tú nos facturarás por el mismo importe, permitiéndote mantener tu prestigio sin comisiones aparentes.
                      </p>
                      
                      <FormField
                        control={form.control}
                        name={"agencyBilling.requestInvoice" as any}
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                            <FormControl>
                              <Checkbox
                                checked={field.value as boolean}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="flex-1 space-y-1">
                              <FormLabel>Solicitar facturación al cliente</FormLabel>
                              <FormDescription>
                                Marca esta opción si deseas que facturemos directamente a tu cliente
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      {form.watch("agencyBilling.requestInvoice") && (
                        <div className="space-y-6 border rounded-md p-4 bg-muted/30">
                          <FormField
                            control={form.control}
                            name={"agencyBilling.invoiceAmount" as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Importe a facturar (€)</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ej: 150" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Importe que facturaremos a tu cliente (y que tú nos facturarás a nosotros)
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name={"agencyBilling.clientName" as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre del cliente</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nombre completo" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={"agencyBilling.clientTaxId" as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>NIF/CIF</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ej: B12345678" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name={"agencyBilling.clientEmail" as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input placeholder="ejemplo@correo.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={"agencyBilling.clientPhone" as any}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Teléfono</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Ej: 600123456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={form.control}
                            name={"agencyBilling.clientAddress" as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Dirección de facturación</FormLabel>
                                <FormControl>
                                  <Input placeholder="Dirección completa" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={"agencyBilling.notes" as any}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Notas adicionales para la factura</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Información adicional para la factura..."
                                    className="resize-none"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Upselling Services Section */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Servicios Adicionales</h3>
                  </div>
                  <Separator className="my-4" />
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Mejora tu certificado con estos servicios premium que te ayudarán a destacar tu propiedad.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name={"upsellingServices.photography" as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <FormLabel>Fotografía Profesional</FormLabel>
                              <span className="font-medium text-primary">{SERVICE_PRICES.photography}€</span>
                            </div>
                            <FormDescription>
                              Sesión fotográfica profesional del inmueble con 15 fotos de alta calidad
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"upsellingServices.matterport" as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <FormLabel>Tour Virtual Matterport</FormLabel>
                              <span className="font-medium text-primary">{SERVICE_PRICES.matterport}€</span>
                            </div>
                            <FormDescription>
                              Recorrido virtual 3D completo del inmueble para una experiencia inmersiva
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"upsellingServices.floorPlan" as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <FormLabel>Plano del Inmueble</FormLabel>
                              <span className="font-medium text-primary">{SERVICE_PRICES.floorPlan}€</span>
                            </div>
                            <FormDescription>
                              Plano técnico detallado del inmueble con medidas exactas y distribución
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={"upsellingServices.arRenovation" as any}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:border-primary hover:bg-muted/50 transition-colors">
                          <FormControl>
                            <Checkbox
                              checked={field.value as boolean}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="flex-1 space-y-1">
                            <div className="flex justify-between">
                              <FormLabel>Reforma con Realidad Aumentada</FormLabel>
                              <span className="font-medium text-primary">{SERVICE_PRICES.arRenovation}€</span>
                            </div>
                            <FormDescription>
                              Visualización de posibles reformas con realidad aumentada para mostrar el potencial del inmueble
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Total price display */}
                  {calculateTotalPrice() > 0 && (
                    <div className="mt-4 p-4 border rounded-md bg-muted">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total servicios adicionales:</span>
                        <span className="text-lg font-bold text-primary">{calculateTotalPrice()}€</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Los servicios adicionales se facturarán por separado del certificado.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <Button variant="outline" type="button" onClick={onCancel}>
                  Cancelar
                </Button>
                <Button type="submit">Crear Certificado</Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
} 