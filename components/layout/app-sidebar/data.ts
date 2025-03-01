// This is sample data.
import {
  BarChart3,
  Building,
  FileCheck,
  CreditCard,
  FileText,
  Home,
  Image,
  LayoutDashboard,
  Map,
  MessageSquare,
  Settings2,
  Users,
  Video,
  Wallet,
  Mail,
  Phone,
} from "lucide-react"

export const data = {
  user: {
    name: "Usuario",
    email: "usuario@ejemplo.com",
    avatar: "/avatars/user.jpg",
  },
  teams: [
    {
      name: "Mi Inmobiliaria",
      logo: Building,
      plan: "Premium",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },
    {
      title: "Certificados",
      url: "#",
      icon: FileCheck,
      items: [
        {
          title: "Certificados Energéticos",
          url: "/admin/certificates",
        },
        {
          title: "Cédulas de Habitabilidad",
          url: "/admin/certificates/habitability",
        },
        {
          title: "Todos los Certificados",
          url: "/admin/certificates",
        },
        {
          title: "Crear Nuevo",
          url: "/admin/certificates/new",
        },
      ],
    },
    {
      title: "Propiedades",
      url: "#",
      icon: Home,
      items: [
        {
          title: "Mis Propiedades",
          url: "/admin/properties",
        },
        {
          title: "Añadir Propiedad",
          url: "/admin/properties/new",
        },
        {
          title: "Gestionar Propiedades",
          url: "/admin/properties/manage",
        },
      ],
    },
    {
      title: "Servicios Premium",
      url: "#",
      icon: Image,
      items: [
        {
          title: "Fotografía Profesional",
          url: "/admin/services/photography",
        },
        {
          title: "Tours Virtuales Matterport",
          url: "/admin/services/matterport",
        },
        {
          title: "Planos de Inmuebles",
          url: "/admin/services/floorplans",
        },
        {
          title: "Reformas con RA",
          url: "/admin/services/ar-renovation",
        },
        {
          title: "Solicitar Servicio",
          url: "/admin/services/request",
        },
      ],
    },
    {
      title: "Clientes",
      url: "/admin/clients/manage",
      icon: Users
    },
    {
      title: "Comunicaciones",
      url: "#",
      icon: MessageSquare,
      items: [
        {
          title: "Chat Unificado",
          url: "/admin/chat",
        },
        {
          title: "Email",
          url: "/admin/communications/email",
        },
        {
          title: "Llamadas",
          url: "/admin/communications/calls",
        },
        {
          title: "Historial",
          url: "/admin/communications/history",
        },
      ],
    },
    {
      title: "Facturación",
      url: "#",
      icon: CreditCard,
      items: [
        {
          title: "Solicitudes de Facturación",
          url: "/admin/billing-requests",
        },
        {
          title: "Historial de Pagos",
          url: "/admin/billing/history",
        },
        {
          title: "Suscripción",
          url: "/admin/billing/subscription",
        },
        {
          title: "Métodos de Pago",
          url: "/admin/billing/payment-methods",
        },
        {
          title: "Facturas",
          url: "/admin/billing/invoices",
        },
      ],
    },
    {
      title: "Informes",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Resumen de Actividad",
          url: "/admin/reports/activity",
        },
        {
          title: "Certificados Emitidos",
          url: "/admin/reports/certificates",
        },
        {
          title: "Servicios Contratados",
          url: "/admin/reports/services",
        },
      ],
    },
    {
      title: "Ajustes",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Perfil",
          url: "/admin/settings/profile",
        },
        {
          title: "Cuenta",
          url: "/admin/settings/account",
        },
        {
          title: "Empresa",
          url: "/admin/settings/company",
        },
        {
          title: "Notificaciones",
          url: "/admin/settings/notifications",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Ayuda y Soporte",
      url: "/admin/support",
      icon: MessageSquare,
    },
    {
      name: "Recursos",
      url: "/admin/resources",
      icon: FileText,
    },
    {
      name: "Tutoriales",
      url: "/admin/tutorials",
      icon: Video,
    },
  ],
}