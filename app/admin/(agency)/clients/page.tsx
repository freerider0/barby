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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Suspense, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  FileText, 
  Home, 
  Users,
  X
} from "lucide-react";
import FilterDialog from "@/components/clients/filter-dialog";

// Define client type
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Propietario" | "Agente";
  properties: number;
  certificates: number;
  status: "active" | "inactive";
  lastContact: string;
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
    avatar: "",
  },
];

export default function ClientsPage() {
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
        <Link href="/admin/clients/new" passHref>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            <span>Nuevo Cliente</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Clientes</CardTitle>
            <CardDescription>Todos los clientes registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">42</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Propietarios</CardTitle>
            <CardDescription>Clientes propietarios de inmuebles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">28</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Agentes</CardTitle>
            <CardDescription>Agentes inmobiliarios colaboradores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="owners">Propietarios</TabsTrigger>
          <TabsTrigger value="agents">Agentes</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
        </TabsList>

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
          
          {/* Reemplazar el menú de filtro simple por el diálogo de filtros avanzados */}
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
          <Suspense fallback={<ClientsListSkeleton />}>
            <ClientsList clients={filteredClients} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="owners" className="mt-0">
          <Suspense fallback={<ClientsListSkeleton />}>
            <ClientsList clients={filteredClients.filter(client => client.type === "Propietario")} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="agents" className="mt-0">
          <Suspense fallback={<ClientsListSkeleton />}>
            <ClientsList clients={filteredClients.filter(client => client.type === "Agente")} />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-0">
          <Suspense fallback={<ClientsListSkeleton />}>
            <ClientsList 
              clients={[...filteredClients].sort((a, b) => 
                new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime()
              ).slice(0, 5)} 
            />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ClientsListProps {
  clients: Client[];
}

function ClientsList({ clients }: ClientsListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-center">Propiedades</TableHead>
            <TableHead className="text-center">Certificados</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.length > 0 ? (
            clients.map((client) => (
              <TableRow key={client.id}>
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
                  <Badge variant={client.type === "Propietario" ? "default" : "secondary"}>
                    {client.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/admin/clients/${client.id}/properties`} className="flex items-center justify-center gap-1 hover:underline">
                    <Home className="h-3 w-3" />
                    <span>{client.properties}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <Link href={`/admin/clients/${client.id}/certificates`} className="flex items-center justify-center gap-1 hover:underline">
                    <FileText className="h-3 w-3" />
                    <span>{client.certificates}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "outline" : "destructive"} className={client.status === "active" ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}>
                    {client.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
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
              <TableCell colSpan={7} className="h-24 text-center">
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