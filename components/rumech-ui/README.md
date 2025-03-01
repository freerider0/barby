# Rumech UI Components

This directory contains custom UI components built for the application.

## Components

### StatCardWithChart

A statistics card component with a gradient area chart. Perfect for dashboards and analytics pages.

![StatCardWithChart Example](https://via.placeholder.com/600x150.png?text=StatCardWithChart+Example)

#### Usage

```tsx
import { StatCardWithChart } from "@/components/rumech-ui/stat-card-with-chart";

// Sample data
const data = [
  { name: "Jan", value: 30 },
  { name: "Feb", value: 40 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 50 },
  { name: "May", value: 55 },
  { name: "Jun", value: 60 },
];

// Basic usage
<StatCardWithChart 
  title="Total Users" 
  description="Active users this month" 
  value="60" 
  data={data}
  color="#6366f1"
  trend="up"
/>

// With custom chart height
<StatCardWithChart 
  title="Revenue" 
  description="Monthly revenue" 
  value="$10,000" 
  data={data}
  color="#10b981"
  trend="up"
  chartHeight={80}
/>

// With custom value styling
<StatCardWithChart 
  title="Conversion Rate" 
  description="Visitor to customer" 
  value="12%" 
  data={data}
  color="#f43f5e"
  trend="down"
  valueClassName="text-red-600"
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | - | The title of the card |
| description | string | - | The description of the card |
| value | string \| number | - | The main value to display |
| data | ChartDataPoint[] | - | Array of data points for the chart |
| color | string | - | The color of the chart (hex code) |
| trend | "up" \| "down" \| "neutral" | - | Optional trend indicator |
| className | string | - | Optional additional class name for the card |
| valueClassName | string | - | Optional additional class name for the value |
| chartHeight | number | 64 | Optional height for the chart in pixels |

#### Examples

See the example implementation in `components/rumech-ui/examples/stat-card-example.tsx`. 