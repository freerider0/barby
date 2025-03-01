"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  MoreHorizontal, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Download, 
  Send 
} from "lucide-react";

// Definir la interfaz para las solicitudes de facturación
interface BillingRequest {
  id: string;
  certificateId: string;
  certificateType: "energy" | "habitability";
  propertyAddress: string;
  agencyName: string;
  agencyId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientTaxId: string;
  amount: number;
  status: "pending" | "approved" | "rejected" | "invoiced";
  requestDate: string;
  notes?: string;
}

// Datos de ejemplo para las solicitudes de facturación
const sampleBillingRequests: BillingRequest[] = [
  {
    id: "1",
    certificateId: "CERT-001",
    certificateType: "energy",
    propertyAddress: "Calle Mayor 15, 3º B, Madrid",
    agencyName: "Inmobiliaria Ejemplo",
    agencyId: "AG001",
    clientName: "María García",
    clientEmail: "maria.garcia@ejemplo.com",
    clientPhone: "612345678",
    clientAddress: "Calle Mayor 15, 3º B, Madrid",
    clientTaxId: "12345678A",
    amount: 150,
    status: "pending",
    requestDate: "2023-05-15",
    notes: "Cliente prioritario"
  },
  {
    id: "2",
    certificateId: "CERT-002",
    certificateType: "habitability",
    propertyAddress: "Avenida Diagonal 42, Barcelona",
    agencyName: "Barcelona Properties",
    agencyId: "AG002",
    clientName: "Juan Rodríguez",
    clientEmail: "juan.rodriguez@ejemplo.com",
    clientPhone: "623456789",
    clientAddress: "Avenida Diagonal 42, Barcelona",
    clientTaxId: "87654321B",
    amount: 120,
    status: "approved",
    requestDate: "2023-05-10"
  },
  {
    id: "3",
    certificateId: "CERT-003",
    certificateType: "energy",
    propertyAddress: "Calle Gran Vía 78, Madrid",
    agencyName: "Madrid Real Estate",
    agencyId: "AG003",
    clientName: "Ana Martínez",
    clientEmail: "ana.martinez@ejemplo.com",
    clientPhone: "634567890",
    clientAddress: "Calle Gran Vía 78, Madrid",
    clientTaxId: "23456789C",
    amount: 200,
    status: "invoiced",
    requestDate: "2023-04-05"
  },
  {
    id: "4",
    certificateId: "CERT-004",
    certificateType: "energy",
    propertyAddress: "Calle Serrano 25, Madrid",
    agencyName: "Luxury Homes",
    agencyId: "AG004",
    clientName: "Carlos López",
    clientEmail: "carlos.lopez@ejemplo.com",
    clientPhone: "645678901",
    clientAddress: "Calle Serrano 25, Madrid",
    clientTaxId: "34567890D",
    amount: 180,
    status: "rejected",
    requestDate: "2023-04-20",
    notes: "Datos fiscales incorrectos"
  }
];

export default function AgencyBillingRequests() {
  const [billingRequests, setBillingRequests] = useState<BillingRequest[]>(sampleBillingRequests);
  const [selectedRequest, setSelectedRequest] = useState<BillingRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Función para aprobar una solicitud
  const approveRequest = (id: string) => {
    setBillingRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
    setIsApproveDialogOpen(false);
    toast.success("Solicitud aprobada", {
      description: "La solicitud de facturación ha sido aprobada"
    });
  };

  // Función para rechazar una solicitud
  const rejectRequest = (id: string, reason: string) => {
    setBillingRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "rejected", notes: reason } : req
      )
    );
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    toast.success("Solicitud rechazada", {
      description: "La solicitud de facturación ha sido rechazada"
    });
  };

  // Función para marcar como facturada
  const markAsInvoiced = (id: string) => {
    setBillingRequests(prev => 
      prev.map(req => 
        req.id === id ? { ...req, status: "invoiced" } : req
      )
    );
    toast.success("Marcada como facturada", {
      description: "La solicitud ha sido marcada como facturada"
    });
  };

  // Función para obtener el color del badge según el estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "outline";
      case "invoiced":
        return "default";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  // Función para obtener la clase del badge según el estado
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      default:
        return "";
    }
  };

  // Función para obtener la etiqueta del estado
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobada";
      case "invoiced":
        return "Facturada";
      case "rejected":
        return "Rechazada";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitudes de Facturación de Agencias</CardTitle>
        <CardDescription>
          Gestiona las solicitudes de facturación de las agencias inmobiliarias
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificado</TableHead>
              <TableHead>Agencia</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Importe</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {billingRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="font-medium">{request.certificateId}</div>
                  <div className="text-xs text-muted-foreground">{request.propertyAddress}</div>
                </TableCell>
                <TableCell>{request.agencyName}</TableCell>
                <TableCell>
                  <div className="font-medium">{request.clientName}</div>
                  <div className="text-xs text-muted-foreground">{request.clientEmail}</div>
                </TableCell>
                <TableCell className="font-medium">{request.amount}€</TableCell>
                <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusBadgeVariant(request.status)} 
                    className={getStatusBadgeClass(request.status)}
                  >
                    {getStatusLabel(request.status)}
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
                      <DropdownMenuItem onClick={() => {
                        setSelectedRequest(request);
                        setIsDetailsOpen(true);
                      }}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </DropdownMenuItem>
                      
                      {request.status === "pending" && (
                        <>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            setIsApproveDialogOpen(true);
                          }}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                            <span>Aprobar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedRequest(request);
                            setIsRejectDialogOpen(true);
                          }}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" />
                            <span>Rechazar</span>
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {request.status === "approved" && (
                        <DropdownMenuItem onClick={() => markAsInvoiced(request.id)}>
                          <FileText className="mr-2 h-4 w-4 text-blue-600" />
                          <span>Marcar como facturada</span>
                        </DropdownMenuItem>
                      )}
                      
                      {request.status === "invoiced" && (
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          <span>Descargar factura</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Diálogo de detalles */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de facturación
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Certificado</h4>
                  <p className="font-medium">{selectedRequest.certificateId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Tipo</h4>
                  <p className="font-medium">
                    {selectedRequest.certificateType === "energy" ? "Energético" : "Habitabilidad"}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Propiedad</h4>
                <p className="font-medium">{selectedRequest.propertyAddress}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium">Datos de la Agencia</h4>
                <p className="font-medium">{selectedRequest.agencyName}</p>
                <p className="text-sm text-muted-foreground">ID: {selectedRequest.agencyId}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium">Datos del Cliente</h4>
                <p className="font-medium">{selectedRequest.clientName}</p>
                <p className="text-sm">{selectedRequest.clientEmail}</p>
                <p className="text-sm">{selectedRequest.clientPhone}</p>
                <p className="text-sm">{selectedRequest.clientAddress}</p>
                <p className="text-sm">NIF/CIF: {selectedRequest.clientTaxId}</p>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium">Importe a Facturar</h4>
                <p className="text-xl font-bold text-primary">{selectedRequest.amount}€</p>
              </div>
              
              {selectedRequest.notes && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium">Notas</h4>
                  <p className="text-sm">{selectedRequest.notes}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium">Estado</h4>
                <Badge 
                  variant={getStatusBadgeVariant(selectedRequest.status)} 
                  className={getStatusBadgeClass(selectedRequest.status)}
                >
                  {getStatusLabel(selectedRequest.status)}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de aprobación */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Aprobar Solicitud</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas aprobar esta solicitud de facturación?
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Certificado</h4>
                <p>{selectedRequest.certificateId} - {selectedRequest.propertyAddress}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Agencia</h4>
                <p>{selectedRequest.agencyName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Cliente</h4>
                <p>{selectedRequest.clientName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Importe</h4>
                <p className="text-xl font-bold text-primary">{selectedRequest.amount}€</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedRequest && approveRequest(selectedRequest.id)}
              className="bg-green-600 hover:bg-green-700"
            >
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de rechazo */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Por favor, indica el motivo del rechazo de esta solicitud
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium">Certificado</h4>
                <p>{selectedRequest.certificateId} - {selectedRequest.propertyAddress}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Agencia</h4>
                <p>{selectedRequest.agencyName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Cliente</h4>
                <p>{selectedRequest.clientName}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium">Importe</h4>
                <p className="font-medium">{selectedRequest.amount}€</p>
              </div>
              
              <div>
                <Label htmlFor="rejection-reason">Motivo del rechazo</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Indica el motivo por el que rechazas esta solicitud..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => selectedRequest && rejectRequest(selectedRequest.id, rejectionReason)}
              variant="destructive"
              disabled={!rejectionReason.trim()}
            >
              Rechazar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 