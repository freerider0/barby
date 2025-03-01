"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

// Define the data type for the chart
export type ChartDataPoint = {
  name: string;
  value: number;
};

// Define the props for the StatCardWithChart component
export interface StatCardWithChartProps {
  title: string;
  description: string;
  value: string | number;
  data: ChartDataPoint[];
  color: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
  valueClassName?: string;
  chartHeight?: number;
}

/**
 * A statistics card component with a gradient area chart
 * 
 * @param title - The title of the card
 * @param description - The description of the card
 * @param value - The main value to display
 * @param data - Array of data points for the chart
 * @param color - The color of the chart (hex code)
 * @param trend - Optional trend indicator (up, down, or neutral)
 * @param className - Optional additional class name for the card
 * @param valueClassName - Optional additional class name for the value
 * @param chartHeight - Optional height for the chart (default: 64px)
 */
export function StatCardWithChart({ 
  title, 
  description, 
  value, 
  data, 
  color, 
  trend,
  className,
  valueClassName,
  chartHeight = 64
}: StatCardWithChartProps) {
  // Create a unique ID for the gradient
  const gradientId = `gradient-${title.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {trend && (
            <div>
              {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold mb-2 ${valueClassName}`}>{value}</div>
        <div className={`h-${chartHeight / 4} w-full`} style={{ height: `${chartHeight}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fill={`url(#${gradientId})`} 
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
} 