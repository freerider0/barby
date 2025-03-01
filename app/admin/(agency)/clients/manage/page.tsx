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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  ArrowLeft,
  Download,
  Filter,
  MoreHorizontal, 
  Search, 
  SlidersHorizontal, 
  Trash, 
  UserPlus, 
  Users,
  PlusCircle,
  Mail,
  Phone,
  FileText,
  Home,
  Upload,
  CheckCircle,
  XCircle,
  X
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import FilterDialog from "@/components/clients/filter-dialog";
import { StatCardWithChart, type ChartDataPoint } from "@/components/rumech-ui/stat-card-with-chart";

// Define client type
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Propietario" | "Agente" | "Comprador" | "Inquilino";
  properties: number;
  certificates: number;
  status: "active" | "inactive" | "lead";
  lastContact: string;
  createdAt: string;
  avatar: string;
}

// Tipo para las condiciones de filtro
interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  value2?: string;
}

// Sample client data
const clients: Client[] = [
  {
    id: "1",
    name: "María García",
    email: "maria.garcia@ejemplo.com",
    phone: "612345678",
    type: "Propietario",
    properties: 2,
    certificates: 3,
    status: "active",
    lastContact: "2023-02-15",
    createdAt: "2022-10-05",
    avatar: "",
  },
  {
    id: "2",
    name: "Juan Rodríguez",
    email: "juan.rodriguez@ejemplo.com",
    phone: "623456789",
    type: "Propietario",
    properties: 1,
    certificates: 1,
    status: "active",
    lastContact: "2023-02-10",
    createdAt: "2022-11-12",
    avatar: "",
  },
  {
    id: "3",
    name: "Ana Martínez",
    email: "ana.martinez@ejemplo.com",
    phone: "634567890",
    type: "Agente",
    properties: 5,
    certificates: 8,
    status: "active",
    lastContact: "2023-02-18",
    createdAt: "2022-08-23",
    avatar: "",
  },
  {
    id: "4",
    name: "Carlos López",
    email: "carlos.lopez@ejemplo.com",
    phone: "645678901",
    type: "Propietario",
    properties: 1,
    certificates: 2,
    status: "inactive",
    lastContact: "2023-01-05",
    createdAt: "2022-12-01",
    avatar: "",
  },
  {
    id: "5",
    name: "Laura Sánchez",
    email: "laura.sanchez@ejemplo.com",
    phone: "656789012",
    type: "Agente",
    properties: 3,
    certificates: 6,
    status: "active",
    lastContact: "2023-02-20",
    createdAt: "2022-09-15",
    avatar: "",
  },
  {
    id: "6",
    name: "Pedro Gómez",
    email: "pedro.gomez@ejemplo.com",
    phone: "667890123",
    type: "Comprador",
    properties: 0,
    certificates: 0,
    status: "lead",
    lastContact: "2023-02-22",
    createdAt: "2023-01-10",
    avatar: "",
  },
  {
    id: "7",
    name: "Lucía Fernández",
    email: "lucia.fernandez@ejemplo.com",
    phone: "678901234",
    type: "Inquilino",
    properties: 0,
    certificates: 1,
    status: "active",
    lastContact: "2023-02-19",
    createdAt: "2022-10-20",
    avatar: "",
  },
  {
    id: "8",
    name: "Miguel Torres",
    email: "miguel.torres@ejemplo.com",
    phone: "689012345",
    type: "Propietario",
    properties: 3,
    certificates: 4,
    status: "active",
    lastContact: "2023-02-17",
    createdAt: "2022-07-05",
    avatar: "",
  },
];

// Sample data for the statistics charts
const chartData = {
  total: [
    { name: "Jan", value: 30 },
    { name: "Feb", value: 32 },
    { name: "Mar", value: 35 },
    { name: "Apr", value: 38 },
    { name: "May", value: 40 },
    { name: "Jun", value: 42 },
  ],
  active: [
    { name: "Jan", value: 25 },
    { name: "Feb", value: 28 },
    { name: "Mar", value: 30 },
    { name: "Apr", value: 32 },
    { name: "May", value: 34 },
    { name: "Jun", value: 36 },
  ],
  inactive: [
    { name: "Jan", value: 4 },
    { name: "Feb", value: 3 },
    { name: "Mar", value: 4 },
    { name: "Apr", value: 5 },
    { name: "May", value: 4 },
    { name: "Jun", value: 4 },
  ],
  leads: [
    { name: "Jan", value: 1 },
    { name: "Feb", value: 1 },
    { name: "Mar", value: 1 },
    { name: "Apr", value: 1 },
    { name: "May", value: 2 },
    { name: "Jun", value: 2 },
  ],
};

export default function ManageClientsPage() {
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterCondition[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>(clients);

  // Función para aplicar los filtros
  const handleApplyFilters = (filters: FilterCondition[]) => {
    setActiveFilters(filters);
    
    // Aplicar los filtros a la lista de clientes
    if (filters.length === 0) {
      // Si no hay filtros, mostrar todos los clientes
      setFilteredClients(clients);
    } else {
      // Filtrar los clientes según las condiciones
      const filtered = clients.filter(client => {
        // Un cliente pasa el filtro si cumple TODAS las condiciones
        return filters.every(filter => {
          const clientValue = client[filter.field as keyof Client];
          
          // Manejar diferentes tipos de operadores
          switch (filter.operator) {
            case "equals":
              return String(clientValue) === filter.value;
            case "contains":
              return String(clientValue).toLowerCase().includes(filter.value.toLowerCase());
            case "startsWith":
              return String(clientValue).toLowerCase().startsWith(filter.value.toLowerCase());
            case "endsWith":
              return String(clientValue).toLowerCase().endsWith(filter.value.toLowerCase());
            case "greaterThan":
              return Number(clientValue) > Number(filter.value);
            case "lessThan":
              return Number(clientValue) < Number(filter.value);
            case "between":
              return filter.value2 
                ? Number(clientValue) >= Number(filter.value) && Number(clientValue) <= Number(filter.value2)
                : Number(clientValue) === Number(filter.value);
            default:
              return true;
          }
        });
      });
      
      setFilteredClients(filtered);
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
    setFilteredClients(clients);
  };

  // Función para manejar la búsqueda
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Si hay un término de búsqueda, filtrar por él además de los filtros activos
    if (term) {
      const searched = filteredClients.filter(client => 
        client.name.toLowerCase().includes(term.toLowerCase()) ||
        client.email.toLowerCase().includes(term.toLowerCase()) ||
        client.phone.includes(term)
      );
      setFilteredClients(searched);
    } else {
      // Si no hay término, aplicar solo los filtros activos
      handleApplyFilters(activeFilters);
    }
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(client => client.id));
    }
  };

  const toggleSelectClient = (clientId: string) => {
    if (selectedClients.includes(clientId)) {
      setSelectedClients(selectedClients.filter(id => id !== clientId));
    } else {
      setSelectedClients([...selectedClients, clientId]);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/clients" passHref>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Gestión Avanzada de Clientes</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/clients/new" passHref>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>Nuevo Cliente</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCardWithChart 
          title="Total Clientes" 
          description="Todos los clientes" 
          value="42" 
          data={chartData.total}
          color="#6366f1"
          trend="up"
        />
        <StatCardWithChart 
          title="Activos" 
          description="Clientes activos" 
          value="36" 
          data={chartData.active}
          color="#10b981"
          trend="up"
        />
        <StatCardWithChart 
          title="Inactivos" 
          description="Clientes inactivos" 
          value="4" 
          data={chartData.inactive}
          color="#f43f5e"
          trend="neutral"
        />
        <StatCardWithChart 
          title="Potenciales" 
          description="Clientes potenciales" 
          value="2" 
          data={chartData.leads}
          color="#3b82f6"
          trend="up"
        />
      </div>

      {/* Sección de filtros avanzados */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar clientes..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          {/* Reemplazar la sección de filtros por el diálogo de filtros composables */}
          <FilterDialog onApplyFilters={handleApplyFilters} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar a Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar a CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Exportar a PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Importar</span>
          </Button>
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
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Listado de Clientes</CardTitle>
            <CardDescription>
              Gestiona todos tus clientes desde aquí
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <MoreHorizontal className="h-4 w-4" />
                  <span>Acciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Acciones en Lote</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="flex items-center gap-2 w-full">
                    <Users className="h-4 w-4" />
                    <span>Asignar Agente</span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="flex items-center gap-2 w-full">
                    <Download className="h-4 w-4" />
                    <span>Exportar Seleccionados</span>
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <span className="flex items-center gap-2 w-full">
                    <Trash className="h-4 w-4" />
                    <span>Eliminar Seleccionados</span>
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ClientsListSkeleton />}>
            <ClientsManagementTable 
              clients={filteredClients} 
              selectedClients={selectedClients}
              toggleSelectAll={toggleSelectAll}
              toggleSelectClient={toggleSelectClient}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

interface ClientsManagementTableProps {
  clients: Client[];
  selectedClients: string[];
  toggleSelectAll: () => void;
  toggleSelectClient: (clientId: string) => void;
}

function ClientsManagementTable({ 
  clients, 
  selectedClients, 
  toggleSelectAll, 
  toggleSelectClient 
}: ClientsManagementTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={clients.length > 0 && selectedClients.length === clients.length} 
                onCheckedChange={toggleSelectAll}
                aria-label="Seleccionar todos"
              />
            </TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Propiedades</TableHead>
            <TableHead className="text-center">Certificados</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Creado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedClients.includes(client.id)} 
                    onCheckedChange={() => toggleSelectClient(client.id)}
                    aria-label={`Seleccionar ${client.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={client.avatar} alt={client.name} />
                      <AvatarFallback>{client.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Último contacto: {new Date(client.lastContact).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3 w-3" />
                      <span>{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      <span>{client.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    client.type === "Propietario" ? "default" : 
                    client.type === "Agente" ? "secondary" :
                    client.type === "Comprador" ? "outline" : "default"
                  }>
                    {client.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{client.properties}</TableCell>
                <TableCell className="text-center">{client.certificates}</TableCell>
                <TableCell>
                  <Badge variant={
                    client.status === "active" ? "outline" : 
                    client.status === "inactive" ? "destructive" : "secondary"
                  } className={
                    client.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : 
                    client.status === "lead" ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : ""
                  }>
                    {client.status === "active" ? "Activo" : 
                     client.status === "inactive" ? "Inactivo" : "Potencial"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(client.createdAt).toLocaleDateString()}
                </TableCell>
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
                        <Link href={`/admin/clients/${client.id}`} className="flex w-full">
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/clients/${client.id}/edit`} className="flex w-full">
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/admin/clients/${client.id}/properties`} className="flex w-full">
                          Ver propiedades
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/admin/clients/${client.id}/certificates`} className="flex w-full">
                          Ver certificados
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
              <TableCell colSpan={9} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <p>No se encontraron clientes</p>
                  <p className="text-sm">Intenta con otros filtros o añade nuevos clientes</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function ClientsListSkeleton() {
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