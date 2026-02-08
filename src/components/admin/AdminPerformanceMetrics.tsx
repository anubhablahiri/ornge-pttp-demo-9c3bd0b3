import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const metricsData = {
  weekly: {
    totalTransports: 84,
    onTime: 92,
    avgResponse: '14 min',
    patientSatisfaction: 96,
    criticalCare: 38,
    advancedCare: 29,
    basicCare: 17,
  },
  monthly: {
    totalTransports: 326,
    onTime: 89,
    avgResponse: '16 min',
    patientSatisfaction: 94,
    criticalCare: 145,
    advancedCare: 112,
    basicCare: 69,
  },
  yearly: {
    totalTransports: 4120,
    onTime: 91,
    avgResponse: '15 min',
    patientSatisfaction: 95,
    criticalCare: 1820,
    advancedCare: 1410,
    basicCare: 890,
  },
};

interface Props {
  period: 'weekly' | 'monthly' | 'yearly';
}

export default function AdminPerformanceMetrics({ period }: Props) {
  const m = metricsData[period];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display">Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Total Transports</span>
            <span className="font-semibold text-foreground">{m.totalTransports.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">On-Time Rate</span>
            <span className="font-semibold text-success">{m.onTime}%</span>
          </div>
          <Progress value={m.onTime} className="h-2 [&>div]:bg-success" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Patient Satisfaction</span>
            <span className="font-semibold text-primary">{m.patientSatisfaction}%</span>
          </div>
          <Progress value={m.patientSatisfaction} className="h-2 [&>div]:bg-primary" />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Avg Response Time</span>
            <span className="font-semibold text-foreground">{m.avgResponse}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">By Care Level</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Critical Care</span>
              <span className="font-medium text-destructive">{m.criticalCare}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advanced Care</span>
              <span className="font-medium text-warning">{m.advancedCare}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Basic Care</span>
              <span className="font-medium text-success">{m.basicCare}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
