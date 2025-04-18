"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, AreaChart as RechartsAreaChart, Area } from "recharts"
import { Card } from "./card"

export interface ChartData {
  name: string
  value: number
  date?: string
  count?: number
}

interface ChartProps {
  data: ChartData[]
  dataKey: string
  nameKey: string
  onFilter?: (value: string) => void
  height?: number
  width?: number
}

export function BarChart({ data, dataKey, nameKey, color = "#8884d8", onFilter }: ChartProps) {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="h-4 rounded" 
              style={{ 
                width: `${(item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 100}%`,
                backgroundColor: color
              }}
              onClick={() => onFilter?.(item[nameKey])}
            />
            <span className="text-sm">{item[nameKey]}</span>
            <span className="text-sm font-medium">{item[dataKey]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function PieChart({ data, dataKey, nameKey, colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"], onFilter }: ChartProps) {
  const total = data.reduce((sum, item) => sum + item[dataKey], 0)
  
  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="h-4 rounded" 
              style={{ 
                width: `${(item[dataKey] / total) * 100}%`,
                backgroundColor: colors[index % colors.length]
              }}
              onClick={() => onFilter?.(item[nameKey])}
            />
            <span className="text-sm">{item[nameKey]}</span>
            <span className="text-sm font-medium">{item[dataKey]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function AreaChart({ data, dataKey, nameKey, color = "#82ca9d", onFilter }: ChartProps) {
  return (
    <div className="w-full h-full">
      <div className="flex flex-col space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="h-4 rounded" 
              style={{ 
                width: `${(item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 100}%`,
                backgroundColor: color
              }}
              onClick={() => onFilter?.(item[nameKey])}
            />
            <span className="text-sm">{item[nameKey]}</span>
            <span className="text-sm font-medium">{item[dataKey]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HorizontalBarChart({ data, dataKey, nameKey, onFilter }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis 
          type="category" 
          dataKey={nameKey} 
          width={150}
          tick={{ fontSize: 12 }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend 
          onClick={(e) => onFilter?.(e.value)}
          verticalAlign="top"
          height={36}
        />
        <Bar 
          dataKey={dataKey} 
          fill="#8884d8"
          onClick={(e) => onFilter?.(e[nameKey])}
          cursor="pointer"
        >
          {data.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={entry[nameKey] === 'Unassigned' ? '#94a3b8' : '#8884d8'}
            />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
