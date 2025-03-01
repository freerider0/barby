"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Filter, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tipos de filtros disponibles
type FilterField = 
  | "name" 
  | "email" 
  | "phone" 
  | "type" 
  | "status" 
  | "properties" 
  | "certificates" 
  | "lastContact" 
  | "createdAt";

type FilterOperator = 
  | "equals" 
  | "contains" 
  | "startsWith" 
  | "endsWith" 
  | "greaterThan" 
  | "lessThan" 
  | "between" 
  | "in";

// Estructura de un filtro individual
interface FilterCondition {
  id: string;
  field: FilterField;
  operator: FilterOperator;
  value: string;
  value2?: string; // Para operadores como "between"
}

// Props para el componente
interface FilterDialogProps {
  onApplyFilters: (filters: FilterCondition[]) => void;
}

export default function FilterDialog({ onApplyFilters }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);

  // Añadir un nuevo filtro vacío
  const addFilter = () => {
    const newFilter: FilterCondition = {
      id: Date.now().toString(),
      field: "name",
      operator: "contains",
      value: "",
    };
    setFilters([...filters, newFilter]);
  };

  // Eliminar un filtro
  const removeFilter = (id: string) => {
    setFilters(filters.filter(filter => filter.id !== id));
  };

  // Actualizar un filtro existente
  const updateFilter = (id: string, updates: Partial<FilterCondition>) => {
    setFilters(
      filters.map(filter => 
        filter.id === id ? { ...filter, ...updates } : filter
      )
    );
  };

  // Aplicar los filtros y cerrar el diálogo
  const applyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters([]);
  };

  // Obtener etiqueta legible para un campo
  const getFieldLabel = (field: FilterField): string => {
    const labels: Record<FilterField, string> = {
      name: "Nombre",
      email: "Email",
      phone: "Teléfono",
      type: "Tipo de Cliente",
      status: "Estado",
      properties: "Propiedades",
      certificates: "Certificados",
      lastContact: "Último Contacto",
      createdAt: "Fecha de Creación"
    };
    return labels[field];
  };

  // Obtener etiqueta legible para un operador
  const getOperatorLabel = (operator: FilterOperator): string => {
    const labels: Record<FilterOperator, string> = {
      equals: "es igual a",
      contains: "contiene",
      startsWith: "comienza con",
      endsWith: "termina con",
      greaterThan: "mayor que",
      lessThan: "menor que",
      between: "entre",
      in: "está en"
    };
    return labels[operator];
  };

  // Determinar qué operadores están disponibles para un campo específico
  const getAvailableOperators = (field: FilterField): FilterOperator[] => {
    switch (field) {
      case "name":
      case "email":
      case "phone":
        return ["equals", "contains", "startsWith", "endsWith"];
      case "type":
      case "status":
        return ["equals", "in"];
      case "properties":
      case "certificates":
        return ["equals", "greaterThan", "lessThan", "between"];
      case "lastContact":
      case "createdAt":
        return ["equals", "greaterThan", "lessThan", "between"];
      default:
        return ["equals", "contains"];
    }
  };

  // Renderizar el componente de entrada adecuado según el campo y operador
  const renderValueInput = (filter: FilterCondition) => {
    // Para campos de tipo y estado, mostrar un select
    if (filter.field === "type") {
      return (
        <Select
          value={filter.value}
          onValueChange={(value) => updateFilter(filter.id, { value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Propietario">Propietario</SelectItem>
            <SelectItem value="Agente">Agente</SelectItem>
            <SelectItem value="Comprador">Comprador</SelectItem>
            <SelectItem value="Inquilino">Inquilino</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    if (filter.field === "status") {
      return (
        <Select
          value={filter.value}
          onValueChange={(value) => updateFilter(filter.id, { value })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Seleccionar estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Activo</SelectItem>
            <SelectItem value="inactive">Inactivo</SelectItem>
            <SelectItem value="lead">Potencial</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    // Para fechas
    if (filter.field === "lastContact" || filter.field === "createdAt") {
      return (
        <div className="flex flex-col gap-2">
          <Input
            type="date"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="Seleccionar fecha"
          />
          {filter.operator === "between" && (
            <Input
              type="date"
              value={filter.value2 || ""}
              onChange={(e) => updateFilter(filter.id, { value2: e.target.value })}
              placeholder="Hasta fecha"
            />
          )}
        </div>
      );
    }

    // Para números
    if (filter.field === "properties" || filter.field === "certificates") {
      return (
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            value={filter.value}
            onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
            placeholder="Valor numérico"
          />
          {filter.operator === "between" && (
            <Input
              type="number"
              value={filter.value2 || ""}
              onChange={(e) => updateFilter(filter.id, { value2: e.target.value })}
              placeholder="Hasta valor"
            />
          )}
        </div>
      );
    }

    // Para texto por defecto
    return (
      <Input
        type="text"
        value={filter.value}
        onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
        placeholder="Valor"
      />
    );
  };

  // Generar una representación legible de un filtro
  const getFilterDescription = (filter: FilterCondition): string => {
    const field = getFieldLabel(filter.field);
    const operator = getOperatorLabel(filter.operator);
    
    if (filter.operator === "between" && filter.value2) {
      return `${field} ${operator} ${filter.value} y ${filter.value2}`;
    }
    
    return `${field} ${operator} ${filter.value}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filtros Avanzados</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Filtros Avanzados</DialogTitle>
          <DialogDescription>
            Crea filtros personalizados para encontrar exactamente lo que buscas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 my-4 flex-1 overflow-hidden">
          {filters.length > 0 ? (
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {filters.map((filter) => (
                  <div key={filter.id} className="flex flex-col gap-2 p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Condición de Filtro</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFilter(filter.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Selector de campo */}
                      <div>
                        <label className="text-sm font-medium mb-1 block">Campo</label>
                        <Select
                          value={filter.field}
                          onValueChange={(value: FilterField) => {
                            // Al cambiar el campo, resetear el operador a uno válido para ese campo
                            const validOperators = getAvailableOperators(value);
                            updateFilter(filter.id, { 
                              field: value, 
                              operator: validOperators[0],
                              value: "" // Resetear el valor
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar campo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Nombre</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Teléfono</SelectItem>
                            <SelectItem value="type">Tipo de Cliente</SelectItem>
                            <SelectItem value="status">Estado</SelectItem>
                            <SelectItem value="properties">Propiedades</SelectItem>
                            <SelectItem value="certificates">Certificados</SelectItem>
                            <SelectItem value="lastContact">Último Contacto</SelectItem>
                            <SelectItem value="createdAt">Fecha de Creación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Selector de operador */}
                      <div>
                        <label className="text-sm font-medium mb-1 block">Operador</label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value: FilterOperator) => {
                            updateFilter(filter.id, { 
                              operator: value,
                              // Si cambiamos a un operador que no usa value2, lo eliminamos
                              value2: value === "between" ? filter.value2 : undefined
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar operador" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableOperators(filter.field).map((op) => (
                              <SelectItem key={op} value={op}>
                                {getOperatorLabel(op)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Input de valor */}
                      <div>
                        <label className="text-sm font-medium mb-1 block">Valor</label>
                        {renderValueInput(filter)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No hay filtros definidos.</p>
              <p className="text-sm">Añade un filtro para comenzar a buscar.</p>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2 w-full"
            onClick={addFilter}
          >
            <Plus className="h-4 w-4" />
            <span>Añadir Filtro</span>
          </Button>
          
          {filters.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-medium mb-2">Filtros Activos:</h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Badge key={filter.id} variant="secondary" className="flex items-center gap-1">
                    {getFilterDescription(filter)}
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
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={clearFilters}>
            Limpiar Filtros
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={applyFilters} disabled={filters.length === 0}>
              Aplicar Filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 