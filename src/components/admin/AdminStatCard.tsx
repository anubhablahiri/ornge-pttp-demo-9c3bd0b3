import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AdminStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  accent: 'primary' | 'success' | 'warning' | 'destructive';
}

const accentMap = {
  primary: 'text-primary bg-primary/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  destructive: 'text-destructive bg-destructive/10',
};

export default function AdminStatCard({ icon: Icon, label, value, accent }: AdminStatCardProps) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={cn('p-2.5 rounded-xl', accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
