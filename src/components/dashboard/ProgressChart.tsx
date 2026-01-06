import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartData } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ProgressChartProps {
  data: ChartData[];
  title?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, title = 'Daily Progress' }) => {
  const formattedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  const averageTarget = data.length > 0 ? data[0].target : 2;

  return (
    <Card className="hover-lift">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                interval="preserveStartEnd"
              />
              <YAxis 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--popover-foreground))'
                }}
              />
              <ReferenceLine 
                y={averageTarget} 
                stroke="hsl(var(--success))" 
                strokeDasharray="5 5" 
                label={{ 
                  value: 'Target', 
                  fill: 'hsl(var(--success))', 
                  fontSize: 12,
                  position: 'right'
                }} 
              />
              <Area
                type="monotone"
                dataKey="solved"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#solvedGradient)"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
