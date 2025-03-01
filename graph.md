```mermaid
graph TD
    A[Project Setup] --> B[Database & Auth]
    B --> C[Core Features]
    C --> D[Business Logic]
    
    subgraph "1. Project Setup"
        A1[Next.js + TypeScript] --> A2[UI Setup]
        A2[shadcn + Tailwind] --> A3[Dependencies]
        A3[date-fns, react-hook-form] 
    end
    
    subgraph "2. Database & Auth"
        B1[Prisma Schema] --> B2[NextAuth.js]
        B2 --> B3[JWT + Roles]
        B1 --> B4[UTC Time Fields]
    end
    
    subgraph "3. Core Features"
        C1[API Routes] --> C2[Protected Routes]
        C2 --> C3[Time Management]
        C3 --> C4[Booking Engine]
    end
    
    subgraph "4. Business Logic"
        D1[Admin Dashboard] --> D2[Customer UI]
        D2 --> D3[Mobile Views]
        D3 --> D4[Notifications]
    end
    
    C --> E[Testing]
    D --> E
    E --> F[Deployment]
    
    subgraph "Database Models"
        M1[User/Admin] --- M2[Business]
        M2 --- M3[Services]
        M3 --- M4[BookingSlots]
        M4 --- M5[Bookings]
    end