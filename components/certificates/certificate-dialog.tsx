"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CertificateForm from "./certificate-form";

// Define the types that match what CertificateForm expects
interface Certificate {
  type: "energy" | "habitability";
  address: string;
  // Add other common fields
  [key: string]: any;
}

interface UpsellingServices {
  photography?: boolean;
  matterport?: boolean;
  floorPlan?: boolean;
  arRenovation?: boolean;
}

interface AgencyBilling {
  requestInvoice: boolean;
  invoiceAmount?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  clientTaxId?: string;
  notes?: string;
}

interface CertificateDialogProps {
  isAgency?: boolean;
}

export default function CertificateDialog({ isAgency = true }: CertificateDialogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [initialData, setInitialData] = useState<Partial<Certificate>>({});

  // Check URL parameters on component mount
  useEffect(() => {
    // If "new-certificate" is present in the URL, open the dialog
    if (searchParams.has("new-certificate")) {
      setOpen(true);
      
      // Extract initial data from URL parameters
      const initialFormData: Partial<Certificate> = {};
      
      // Check for certificate type
      if (searchParams.has("type")) {
        const type = searchParams.get("type");
        if (type === "energy" || type === "habitability") {
          initialFormData.type = type;
        }
      }
      
      // Check for address
      if (searchParams.has("address")) {
        initialFormData.address = searchParams.get("address") || "";
      }
      
      // Check for property type
      if (searchParams.has("propertyType")) {
        initialFormData.propertyType = searchParams.get("propertyType") || "";
      }
      
      // Set the initial data
      if (Object.keys(initialFormData).length > 0) {
        setInitialData(initialFormData);
      }
    }
  }, [searchParams]);

  const handleSubmit = (data: Certificate & { 
    upsellingServices?: UpsellingServices,
    agencyBilling?: AgencyBilling 
  }) => {
    // Here you would send the data to your API
    console.log("Certificate data:", data);
    
    // Close the dialog and remove the URL parameter
    setOpen(false);
    
    // Remove all query parameters from the URL without refreshing the page
    const url = new URL(window.location.href);
    // Clear all certificate-related parameters
    url.searchParams.delete("new-certificate");
    url.searchParams.delete("type");
    url.searchParams.delete("address");
    url.searchParams.delete("propertyType");
    router.replace(url.pathname + url.search);
  };

  const handleCancel = () => {
    setOpen(false);
    
    // Remove all query parameters from the URL without refreshing the page
    const url = new URL(window.location.href);
    // Clear all certificate-related parameters
    url.searchParams.delete("new-certificate");
    url.searchParams.delete("type");
    url.searchParams.delete("address");
    url.searchParams.delete("propertyType");
    router.replace(url.pathname + url.search);
  };

  // Helper function to update URL
  const updateURL = (isOpen: boolean) => {
    const url = new URL(window.location.href);
    
    if (isOpen) {
      // Add the parameter to the URL
      url.searchParams.set("new-certificate", "true");
      
      // Add any initial data that might be in state
      if (initialData.type) {
        url.searchParams.set("type", initialData.type);
      }
      if (initialData.address) {
        url.searchParams.set("address", initialData.address);
      }
      if (initialData.propertyType) {
        url.searchParams.set("propertyType", initialData.propertyType);
      }
    } else {
      // Remove all certificate-related parameters
      url.searchParams.delete("new-certificate");
      url.searchParams.delete("type");
      url.searchParams.delete("address");
      url.searchParams.delete("propertyType");
    }
    
    router.replace(url.pathname + url.search);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      updateURL(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Nuevo Certificado</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Certificado</DialogTitle>
          <DialogDescription>
            Introduce los datos necesarios para generar un nuevo certificado energético o cédula de habitabilidad.
          </DialogDescription>
        </DialogHeader>
        <CertificateForm 
          onSubmit={handleSubmit} 
          onCancel={handleCancel} 
          initialData={initialData}
          isAgency={isAgency}
        />
      </DialogContent>
    </Dialog>
  );
} 