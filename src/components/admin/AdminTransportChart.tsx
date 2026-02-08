import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const weeklyData = [
  { name: 'Mon', air: 12, land: 8 },
  { name: 'Tue', air: 15, land: 10 },
  { name: 'Wed', air: 11, land: 14 },
  { name: 'Thu', air: 18, land: 9 },
  { name: 'Fri', air: 14, land: 12 },
  { name: 'Sat', air: 8, land: 6 },
  { name: 'Sun', air: 6, land: 4 },
];

const monthlyData = [
  { name: 'Week 1', air: 78, land: 52 },
  { name: 'Week 2', air: 85, land: 61 },
  { name: 'Week 3', air: 72, land: 58 },
  { name: 'Week 4', air: 91, land: 64 },
];

const yearlyData = [
  { name: 'Jan', air: 320, land: 210 },
  { name: 'Feb', air: 290, land: 195 },
  { name: 'Mar', air: 340, land: 230 },
  { name: 'Apr', air: 310, land: 220 },
  { name: 'May', air: 360, land: 250 },
  { name: 'Jun', air: 380, land: 260 },
  { name: 'Jul', air: 400, land: 280 },
  { name: 'Aug', air: 390, land: 270 },
  { name: 'Sep', air: 350, land: 240 },
  { name: 'Oct', air: 370, land: 255 },
  { name: 'Nov', air: 330, land: 225 },
  { name: 'Dec', air: 300, land: 200 },
];

const dataMap = { weekly: weeklyData, monthly: monthlyData, yearly: yearlyData };

const chartConfig: ChartConfig = {
  air: { label: 'Air Transport', color: 'hsl(22 90% 54%)' },
  land: { label: 'Land Transport', color: 'hsl(212 53% 23%)' },
};

interface Props {
  period: 'weekly' | 'monthly' | 'yearly';
}

export default function AdminTransportChart({ period }: Props) {
  const data = dataMap[period];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display">Transport Volume</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis tickLine={false} axisLine={false} fontSize={12} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="air" fill="var(--color-air)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="land" fill="var(--color-land)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
