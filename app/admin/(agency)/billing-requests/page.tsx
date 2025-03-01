"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { 
  ArrowLeft,
  Search, 
  Filter, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle 
} from "lucide-react";
import AgencyBillingRequests from "@/components/certificates/agency-billing-requests";
import { StatCardWithChart, type ChartDataPoint } from "@/components/rumech-ui/stat-card-with-chart";

// Sample data for the statistics charts
const chartData = {
  total: [
    { name: "Jan", value: 15 },
    { name: "Feb", value: 18 },
    { name: "Mar", value: 20 },
    { name: "Apr", value: 22 },
    { name: "May", value: 23 },
    { name: "Jun", value: 24 },
  ],
  pending: [
    { name: "Jan", value: 6 },
    { name: "Feb", value: 7 },
    { name: "Mar", value: 9 },
    { name: "Apr", value: 10 },
    { name: "May", value: 9 },
    { name: "Jun", value: 8 },
  ],
  approved: [
    { name: "Jan", value: 7 },
    { name: "Feb", value: 8 },
    { name: "Mar", value: 8 },
    { name: "Apr", value: 9 },
    { name: "May", value: 11 },
    { name: "Jun", value: 12 },
  ],
  invoiced: [
    { name: "Jan", value: 2 },
    { name: "Feb", value: 3 },
    { name: "Mar", value: 3 },
    { name: "Apr", value: 3 },
    { name: "May", value: 3 },
    { name: "Jun", value: 4 },
  ],
};

export default function BillingRequestsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard" passHref>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Solicitudes de Facturación</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCardWithChart 
          title="Total Solicitudes" 
          description="Todas las solicitudes" 
          value="24" 
          data={chartData.total}
          color="#6366f1"
          trend="up"
        />
        <StatCardWithChart 
          title="Pendientes" 
          description="Solicitudes por revisar" 
          value="8" 
          data={chartData.pending}
          color="#f59e0b"
          trend="down"
        />
        <StatCardWithChart 
          title="Aprobadas" 
          description="Solicitudes aprobadas" 
          value="12" 
          data={chartData.approved}
          color="#10b981"
          trend="up"
        />
        <StatCardWithChart 
          title="Facturadas" 
          description="Solicitudes facturadas" 
          value="4" 
          data={chartData.invoiced}
          color="#3b82f6"
          trend="up"
        />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="approved">Aprobadas</TabsTrigger>
          <TabsTrigger value="invoiced">Facturadas</TabsTrigger>
          <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar solicitudes..."
              className="pl-8"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filtrar</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Exportar</span>
          </Button>
        </div>

        <TabsContent value="all" className="mt-0">
          <Suspense fallback={<BillingRequestsSkeleton />}>
            <AgencyBillingRequests />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-0">
          <Suspense fallback={<BillingRequestsSkeleton />}>
            {/* Aquí se filtrarían las solicitudes pendientes */}
            <AgencyBillingRequests />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="approved" className="mt-0">
          <Suspense fallback={<BillingRequestsSkeleton />}>
            {/* Aquí se filtrarían las solicitudes aprobadas */}
            <AgencyBillingRequests />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="invoiced" className="mt-0">
          <Suspense fallback={<BillingRequestsSkeleton />}>
            {/* Aquí se filtrarían las solicitudes facturadas */}
            <AgencyBillingRequests />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-0">
          <Suspense fallback={<BillingRequestsSkeleton />}>
            {/* Aquí se filtrarían las solicitudes rechazadas */}
            <AgencyBillingRequests />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BillingRequestsSkeleton() {
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