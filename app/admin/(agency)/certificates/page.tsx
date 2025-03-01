"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  FileText, 
  Calendar, 
  Home,
  X
} from "lucide-react";
import CertificateDialog from "@/components/certificates/certificate-dialog";
import FilterDialog, { FilterCondition } from "@/components/certificates/filter-dialog";
import { StatCardWithChart, type ChartDataPoint } from "@/components/rumech-ui/stat-card-with-chart";

// Define certificate type
interface Certificate {
  id: string;
  type: "energy" | "habitability";
  propertyAddress: string;
  propertyType: string;
  clientName: string;
  status: "draft" | "pending" | "completed" | "expired";
  energyRating?: string;
  issueDate: string;
  expiryDate: string;
  price: number;
}

// Sample certificate data
const certificates: Certificate[] = [
  {
    id: "1",
    type: "energy",
    propertyAddress: "Calle Mayor 15, 3º B, Madrid",
    propertyType: "Piso",
    clientName: "María García",
    status: "completed",
    energyRating: "C",
    issueDate: "2023-01-15",
    expiryDate: "2033-01-15",
    price: 150,
  },
  {
    id: "2",
    type: "habitability",
    propertyAddress: "Avenida Diagonal 42, Barcelona",
    propertyType: "Apartamento",
    clientName: "Juan Rodríguez",
    status: "completed",
    issueDate: "2023-02-10",
    expiryDate: "2033-02-10",
    price: 120,
  },
  {
    id: "3",
    type: "energy",
    propertyAddress: "Calle Gran Vía 78, Madrid",
    propertyType: "Oficina",
    clientName: "Ana Martínez",
    status: "pending",
    issueDate: "2023-03-05",
    expiryDate: "2033-03-05",
    price: 200,
  },
  {
    id: "4",
    type: "energy",
    propertyAddress: "Calle Serrano 25, Madrid",
    propertyType: "Piso",
    clientName: "Carlos López",
    status: "expired",
    energyRating: "E",
    issueDate: "2013-01-20",
    expiryDate: "2023-01-20",
    price: 150,
  },
  {
    id: "5",
    type: "habitability",
    propertyAddress: "Paseo de Gracia 43, Barcelona",
    propertyType: "Casa",
    clientName: "Laura Sánchez",
    status: "draft",
    issueDate: "",
    expiryDate: "",
    price: 180,
  },
];

// Sample data for the statistics charts
const chartData = {
  total: [
    { name: "Jan", value: 32 },
    { name: "Feb", value: 35 },
    { name: "Mar", value: 37 },
    { name: "Apr", value: 39 },
    { name: "May", value: 41 },
    { name: "Jun", value: 42 },
  ],
  energy: [
    { name: "Jan", value: 20 },
    { name: "Feb", value: 22 },
    { name: "Mar", value: 24 },
    { name: "Apr", value: 25 },
    { name: "May", value: 27 },
    { name: "Jun", value: 28 },
  ],
  habitability: [
    { name: "Jan", value: 12 },
    { name: "Feb", value: 13 },
    { name: "Mar", value: 13 },
    { name: "Apr", value: 14 },
    { name: "May", value: 14 },
    { name: "Jun", value: 14 },
  ],
  pending: [
    { name: "Jan", value: 7 },
    { name: "Feb", value: 6 },
    { name: "Mar", value: 8 },
    { name: "Apr", value: 7 },
    { name: "May", value: 6 },
    { name: "Jun", value: 5 },
  ],
};

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>(certificates);

  // Función para aplicar los filtros
  const handleApplyFilters = (filters: FilterCondition[]) => {
    setActiveFilters(filters);
    
    // Aplicar los filtros a la lista de certificados
    if (filters.length === 0) {
      // Si no hay filtros, mostrar todos los certificados
      setFilteredCertificates(certificates);
    } else {
      // Filtrar los certificados según las condiciones
      const filtered = certificates.filter(certificate => {
        // Un certificado pasa el filtro si cumple TODAS las condiciones
        return filters.every(filter => {
          const certificateValue = certificate[filter.field as keyof Certificate];
          
          // Manejar diferentes tipos de operadores
          switch (filter.operator) {
            case "equals":
              return String(certificateValue) === filter.value;
            case "contains":
              return String(certificateValue).toLowerCase().includes(filter.value.toLowerCase());
            case "startsWith":
              return String(certificateValue).toLowerCase().startsWith(filter.value.toLowerCase());
            case "endsWith":
              return String(certificateValue).toLowerCase().endsWith(filter.value.toLowerCase());
            case "greaterThan":
              return Number(certificateValue) > Number(filter.value);
            case "lessThan":
              return Number(certificateValue) < Number(filter.value);
            case "between":
              return filter.value2 
                ? Number(certificateValue) >= Number(filter.value) && Number(certificateValue) <= Number(filter.value2)
                : Number(certificateValue) === Number(filter.value);
            default:
              return true;
          }
        });
      });
      
      setFilteredCertificates(filtered);
    }
  };

  // Función para eliminar un filtro específico
  const removeFilter = (filterId: string) => {
    const updatedFilters = activeFilters.filter(f => f.id !== filterId);
    setActiveFilters(updatedFilters);
    handleApplyFilters(updatedFilters);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    setActiveFilters([]);
    setFilteredCertificates(certificates);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Si hay un término de búsqueda, filtrar por él además de los filtros activos
    if (term) {
      const searched = filteredCertificates.filter(certificate => 
        certificate.propertyAddress.toLowerCase().includes(term.toLowerCase()) ||
        certificate.clientName.toLowerCase().includes(term.toLowerCase()) ||
        certificate.propertyType.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCertificates(searched);
    } else {
      // Si no hay término, aplicar solo los filtros activos
      handleApplyFilters(activeFilters);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Certificados</h1>
        <CertificateDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCardWithChart 
          title="Total Certificados" 
          description="Todos los certificados" 
          value="42" 
          data={chartData.total}
          color="#6366f1"
          trend="up"
        />
        <StatCardWithChart 
          title="Energéticos" 
          description="Certificados energéticos" 
          value="28" 
          data={chartData.energy}
          color="#10b981"
          trend="up"
        />
        <StatCardWithChart 
          title="Habitabilidad" 
          description="Cédulas de habitabilidad" 
          value="14" 
          data={chartData.habitability}
          color="#f59e0b"
          trend="neutral"
        />
        <StatCardWithChart 
          title="Pendientes" 
          description="Certificados en proceso" 
          value="5" 
          data={chartData.pending}
          color="#3b82f6"
          trend="down"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="energy">Energéticos</TabsTrigger>
          <TabsTrigger value="habitability">Habitabilidad</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="expired">Caducados</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar certificados..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Componente de filtros avanzados */}
          <FilterDialog onApplyFilters={handleApplyFilters} />
        </div>

        {/* Mostrar los filtros activos */}
        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Filtros Activos:</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={clearAllFilters}
              >
                Limpiar todos
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map(filter => (
                <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
                  {`${filter.field} ${filter.operator} ${filter.value}${filter.value2 ? ` y ${filter.value2}` : ''}`}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => removeFilter(filter.id)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <TabsContent value="all" className="mt-0">
          <Suspense fallback={<CertificatesListSkeleton />}>
            <CertificatesList certificates={filteredCertificates} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="energy" className="mt-0">
          <Suspense fallback={<CertificatesListSkeleton />}>
            <CertificatesList certificates={filteredCertificates.filter(cert => cert.type === "energy")} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="habitability" className="mt-0">
          <Suspense fallback={<CertificatesListSkeleton />}>
            <CertificatesList certificates={filteredCertificates.filter(cert => cert.type === "habitability")} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <Suspense fallback={<CertificatesListSkeleton />}>
            <CertificatesList certificates={filteredCertificates.filter(cert => cert.status === "pending" || cert.status === "draft")} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="expired" className="mt-0">
          <Suspense fallback={<CertificatesListSkeleton />}>
            <CertificatesList certificates={filteredCertificates.filter(cert => cert.status === "expired")} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CertificatesListProps {
  certificates: Certificate[];
}

function CertificatesList({ certificates }: CertificatesListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Propiedad</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Calificación</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {certificates.length > 0 ? (
            certificates.map((certificate) => (
              <TableRow key={certificate.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <div className="font-medium">{certificate.propertyAddress}</div>
                    <div className="text-xs text-muted-foreground">{certificate.propertyType}</div>
                  </div>
                </TableCell>
                <TableCell>{certificate.clientName}</TableCell>
                <TableCell>
                  <Badge variant={certificate.type === "energy" ? "default" : "secondary"}>
                    {certificate.type === "energy" ? "Energético" : "Habitabilidad"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {certificate.type === "energy" && certificate.energyRating ? (
                    <Badge className={`bg-${getRatingColor(certificate.energyRating)} text-white`}>
                      {certificate.energyRating}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>Emisión: {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "Pendiente"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>Caducidad: {certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : "Pendiente"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(certificate.status)} className={getStatusClass(certificate.status)}>
                    {getStatusLabel(certificate.status)}
                  </Badge>
                </TableCell>
                <TableCell>{certificate.price} €</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menú</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/admin/certificates/${certificate.id}`} className="flex w-full">
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/certificates/${certificate.id}/edit`} className="flex w-full">
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/admin/certificates/${certificate.id}/download`} className="flex w-full">
                          Descargar PDF
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/certificates/${certificate.id}/share`} className="flex w-full">
                          Compartir
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <p>No se encontraron certificados</p>
                  <p className="text-sm">Intenta con otros filtros o añade nuevos certificados</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function CertificatesListSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
}

// Funciones auxiliares para determinar colores y etiquetas según el estado
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "outline";
    case "pending":
      return "secondary";
    case "draft":
      return "default";
    case "expired":
      return "destructive";
    default:
      return "default";
  }
}

function getStatusClass(status: string): string {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "draft":
      return "";
    case "expired":
      return "";
    default:
      return "";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "completed":
      return "Completado";
    case "pending":
      return "En proceso";
    case "draft":
      return "Borrador";
    case "expired":
      return "Caducado";
    default:
      return status;
  }
}

function getRatingColor(rating: string): string {
  switch (rating.toUpperCase()) {
    case "A":
      return "green-500";
    case "B":
      return "green-400";
    case "C":
      return "yellow-500";
    case "D":
      return "yellow-600";
    case "E":
      return "orange-500";
    case "F":
      return "red-500";
    case "G":
      return "red-600";
    default:
      return "gray-500";
  }
}
