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
import { v4 as uuidv4 } from "uuid";

// Definición de tipos para los filtros
export interface FilterCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  value2?: string;
}

interface FilterDialogProps {
  onApplyFilters: (filters: FilterCondition[]) => void;
}

// Campos disponibles para filtrar certificados
const filterFields = [
  { value: "propertyAddress", label: "Dirección de Propiedad" },
  { value: "propertyType", label: "Tipo de Propiedad" },
  { value: "clientName", label: "Nombre del Cliente" },
  { value: "status", label: "Estado" },
  { value: "energyRating", label: "Calificación Energética" },
  { value: "issueDate", label: "Fecha de Emisión" },
  { value: "expiryDate", label: "Fecha de Vencimiento" },
  { value: "price", label: "Precio" },
];

// Operadores disponibles según el tipo de campo
const textOperators = [
  { value: "equals", label: "Es igual a" },
  { value: "contains", label: "Contiene" },
  { value: "startsWith", label: "Comienza con" },
  { value: "endsWith", label: "Termina con" },
];

const numberOperators = [
  { value: "equals", label: "Es igual a" },
  { value: "greaterThan", label: "Mayor que" },
  { value: "lessThan", label: "Menor que" },
  { value: "between", label: "Entre" },
];

const dateOperators = [
  { value: "equals", label: "Es igual a" },
  { value: "greaterThan", label: "Después de" },
  { value: "lessThan", label: "Antes de" },
  { value: "between", label: "Entre" },
];

// Determinar el tipo de campo para mostrar los operadores adecuados
const getFieldType = (field: string): "text" | "number" | "date" => {
  if (field === "price") {
    return "number";
  } else if (field === "issueDate" || field === "expiryDate") {
    return "date";
  } else {
    return "text";
  }
};

// Obtener los operadores según el tipo de campo
const getOperatorsForField = (field: string) => {
  const fieldType = getFieldType(field);
  switch (fieldType) {
    case "number":
      return numberOperators;
    case "date":
      return dateOperators;
    default:
      return textOperators;
  }
};

export default function FilterDialog({ onApplyFilters }: FilterDialogProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [currentFilter, setCurrentFilter] = useState<FilterCondition>({
    id: uuidv4(),
    field: "",
    operator: "",
    value: "",
  });

  // Resetear el filtro actual
  const resetCurrentFilter = () => {
    setCurrentFilter({
      id: uuidv4(),
      field: "",
      operator: "",
      value: "",
    });
  };

  // Añadir un nuevo filtro
  const addFilter = () => {
    if (currentFilter.field && currentFilter.operator && currentFilter.value) {
      setFilters([...filters, { ...currentFilter }]);
      resetCurrentFilter();
    }
  };

  // Eliminar un filtro
  const removeFilter = (id: string) => {
    setFilters(filters.filter((filter) => filter.id !== id));
  };

  // Aplicar los filtros y cerrar el diálogo
  const applyFilters = () => {
    onApplyFilters(filters);
    setOpen(false);
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters([]);
    resetCurrentFilter();
  };

  // Determinar si el campo actual requiere un segundo valor (para operadores "between")
  const needsSecondValue = currentFilter.operator === "between";

  // Determinar el tipo de entrada según el tipo de campo
  const getInputType = (field: string) => {
    const fieldType = getFieldType(field);
    switch (fieldType) {
      case "number":
        return "number";
      case "date":
        return "date";
      default:
        return "text";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span>Filtros Avanzados</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Filtros Avanzados de Certificados</DialogTitle>
          <DialogDescription>
            Crea filtros personalizados para encontrar certificados específicos.
            Puedes combinar múltiples condiciones.
          </DialogDescription>
        </DialogHeader>

        {/* Filtros activos */}
        {filters.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Filtros activos:</div>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const fieldLabel = filterFields.find(f => f.value === filter.field)?.label || filter.field;
                const operatorLabel = getOperatorsForField(filter.field).find(o => o.value === filter.operator)?.label || filter.operator;
                
                return (
                  <Badge key={filter.id} variant="secondary" className="flex items-center gap-1 px-2 py-1">
                    <span>
                      {fieldLabel} {operatorLabel} {filter.value}
                      {filter.value2 ? ` y ${filter.value2}` : ""}
                    </span>
                    <X
                      className="h-3 w-3 ml-1 cursor-pointer"
                      onClick={() => removeFilter(filter.id)}
                    />
                  </Badge>
                );
              })}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs"
            >
              Limpiar todos
            </Button>
          </div>
        )}

        {/* Creador de filtros */}
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            {/* Selector de campo */}
            <div className="col-span-4 sm:col-span-1">
              <Select
                value={currentFilter.field}
                onValueChange={(value) => {
                  setCurrentFilter({
                    ...currentFilter,
                    field: value,
                    operator: "",
                    value: "",
                    value2: undefined,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Campo" />
                </SelectTrigger>
                <SelectContent>
                  {filterFields.map((field) => (
                    <SelectItem key={field.value} value={field.value}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selector de operador (solo visible si se ha seleccionado un campo) */}
            {currentFilter.field && (
              <div className="col-span-4 sm:col-span-1">
                <Select
                  value={currentFilter.operator}
                  onValueChange={(value) => {
                    setCurrentFilter({
                      ...currentFilter,
                      operator: value,
                      value: "",
                      value2: undefined,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {getOperatorsForField(currentFilter.field).map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Campo de valor (solo visible si se ha seleccionado un operador) */}
            {currentFilter.field && currentFilter.operator && (
              <div className={`col-span-4 ${needsSecondValue ? "sm:col-span-1" : "sm:col-span-2"}`}>
                <Input
                  type={getInputType(currentFilter.field)}
                  placeholder="Valor"
                  value={currentFilter.value}
                  onChange={(e) =>
                    setCurrentFilter({
                      ...currentFilter,
                      value: e.target.value,
                    })
                  }
                />
              </div>
            )}

            {/* Segundo campo de valor (solo para operador "between") */}
            {currentFilter.field && needsSecondValue && (
              <div className="col-span-4 sm:col-span-1">
                <Input
                  type={getInputType(currentFilter.field)}
                  placeholder="Segundo valor"
                  value={currentFilter.value2 || ""}
                  onChange={(e) =>
                    setCurrentFilter({
                      ...currentFilter,
                      value2: e.target.value,
                    })
                  }
                />
              </div>
            )}
          </div>

          {/* Botón para añadir el filtro actual */}
          {currentFilter.field && currentFilter.operator && currentFilter.value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full flex items-center justify-center gap-2"
              onClick={addFilter}
            >
              <Plus className="h-4 w-4" />
              <span>Añadir Filtro</span>
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={applyFilters} disabled={filters.length === 0}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 