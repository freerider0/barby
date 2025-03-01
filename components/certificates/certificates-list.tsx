"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DownloadCloud, 
  Eye, 
  FileText, 
  Filter, 
  Home, 
  MoreHorizontal, 
  Search 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CertificateDetail from "./certificate-detail";

// Mock data - this would come from your API
const mockCertificates = [
  {
    id: "cert-001",
    type: "energy",
    address: "Calle Mayor 10, Madrid",
    status: "completed",
    createdAt: "2023-10-15",
    reference: "CEE-2023-001",
  },
  {
    id: "cert-002",
    type: "habitability",
    address: "Avenida Diagonal 220, Barcelona",
    status: "processing",
    createdAt: "2023-10-18",
    reference: "CH-2023-002",
  },
  {
    id: "cert-003",
    type: "energy",
    address: "Calle Serrano 45, Madrid",
    status: "pending",
    createdAt: "2023-10-20",
    reference: "CEE-2023-003",
  },
  {
    id: "cert-004",
    type: "habitability",
    address: "Plaza Catalunya 5, Barcelona",
    status: "completed",
    createdAt: "2023-10-22",
    reference: "CH-2023-004",
  },
  {
    id: "cert-005",
    type: "energy",
    address: "Calle Gran Vía 30, Madrid",
    status: "submitted",
    createdAt: "2023-10-25",
    reference: "CEE-2023-005",
  },
];

// Status badge colors
const statusColors = {
  completed: "green",
  processing: "blue",
  pending: "yellow",
  submitted: "purple",
};

// Type badge colors
const typeColors = {
  energy: "orange",
  habitability: "sky",
};

// Type labels
const typeLabels = {
  energy: "Certificado Energético",
  habitability: "Cédula de Habitabilidad",
};

// Status labels
const statusLabels = {
  completed: "Completado",
  processing: "En Proceso",
  pending: "Pendiente",
  submitted: "Enviado",
};

export default function CertificatesList({ filter = "all" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  
  // Filter certificates based on the filter prop and search query
  const filteredCertificates = mockCertificates.filter((cert) => {
    // Filter by type
    if (filter === "energy" && cert.type !== "energy") return false;
    if (filter === "habitability" && cert.type !== "habitability") return false;
    if (filter === "pending" && cert.status !== "pending") return false;
    
    // Filter by search query
    if (searchQuery && !cert.address.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !cert.reference.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const handleViewDetails = (certificate) => {
    setSelectedCertificate(certificate);
    setDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por dirección o referencia..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Filter className="h-4 w-4" />
          <span>Filtrar</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referencia</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="hidden md:table-cell">Dirección</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCertificates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No se encontraron certificados
                </TableCell>
              </TableRow>
            ) : (
              filteredCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-medium">{cert.reference}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`bg-${typeColors[cert.type]}-50 text-${typeColors[cert.type]}-700 border-${typeColors[cert.type]}-200`}>
                      {cert.type === "energy" ? (
                        <FileText className="h-3 w-3 mr-1" />
                      ) : (
                        <Home className="h-3 w-3 mr-1" />
                      )}
                      {typeLabels[cert.type]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{cert.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`bg-${statusColors[cert.status]}-50 text-${statusColors[cert.status]}-700 border-${statusColors[cert.status]}-200`}>
                      {statusLabels[cert.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{cert.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menú</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <DownloadCloud className="h-4 w-4 mr-2" />
                          Descargar PDF
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
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 