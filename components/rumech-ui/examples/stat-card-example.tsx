"use client";

import { StatCardWithChart, type ChartDataPoint } from "@/components/rumech-ui/stat-card-with-chart";

// Example data for demonstration
const exampleData = {
  sales: [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1800 },
    { name: "Mar", value: 1600 },
    { name: "Apr", value: 2200 },
    { name: "May", value: 2600 },
    { name: "Jun", value: 3100 },
  ],
  users: [
    { name: "Jan", value: 120 },
    { name: "Feb", value: 180 },
    { name: "Mar", value: 240 },
    { name: "Apr", value: 280 },
    { name: "May", value: 320 },
    { name: "Jun", value: 380 },
  ],
  conversion: [
    { name: "Jan", value: 12 },
    { name: "Feb", value: 14 },
    { name: "Mar", value: 11 },
    { name: "Apr", value: 16 },
    { name: "May", value: 18 },
    { name: "Jun", value: 17 },
  ],
  revenue: [
    { name: "Jan", value: 8500 },
    { name: "Feb", value: 12000 },
    { name: "Mar", value: 10500 },
    { name: "Apr", value: 15000 },
    { name: "May", value: 18000 },
    { name: "Jun", value: 22000 },
  ],
};

export default function StatCardExample() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Stat Card With Chart Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCardWithChart 
          title="Total Sales" 
          description="Monthly sales amount" 
          value="$3,100" 
          data={exampleData.sales}
          color="#6366f1"
          trend="up"
        />
        
        <StatCardWithChart 
          title="Active Users" 
          description="Monthly active users" 
          value="380" 
          data={exampleData.users}
          color="#10b981"
          trend="up"
        />
        
        <StatCardWithChart 
          title="Conversion Rate" 
          description="Visitor to customer" 
          value="17%" 
          data={exampleData.conversion}
          color="#f43f5e"
          trend="down"
          chartHeight={80}
        />
        
        <StatCardWithChart 
          title="Revenue" 
          description="Monthly revenue" 
          value="$22,000" 
          data={exampleData.revenue}
          color="#3b82f6"
          trend="up"
          valueClassName="text-blue-600"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Different Sizes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCardWithChart 
          title="Small Chart" 
          description="40px height" 
          value="$3,100" 
          data={exampleData.sales}
          color="#6366f1"
          chartHeight={40}
        />
        
        <StatCardWithChart 
          title="Medium Chart" 
          description="64px height (default)" 
          value="380" 
          data={exampleData.users}
          color="#10b981"
        />
        
        <StatCardWithChart 
          title="Large Chart" 
          description="100px height" 
          value="17%" 
          data={exampleData.conversion}
          color="#f43f5e"
          chartHeight={100}
        />
      </div>
    </div>
  );
} 