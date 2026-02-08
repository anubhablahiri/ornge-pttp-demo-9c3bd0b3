import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download, Plane, AlertTriangle, Building2, Heart,
  BarChart3, Truck, Route, Clock, Users, MapPin,
} from 'lucide-react';

function StatTile({ icon: Icon, value, label, iconColor }: {
  icon: React.ElementType;
  value: string;
  label: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-muted/50 rounded-xl p-5 border border-border">
      <Icon className={`h-10 w-10 shrink-0 ${iconColor || 'text-primary'}`} />
      <div>
        <p className="text-3xl font-bold font-display text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground leading-tight">{label}</p>
      </div>
    </div>
  );
}

function DownloadLink({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-primary hover:text-primary/80 text-xs font-semibold gap-1 px-2"
      onClick={() => {
        // Mock download – generate a simple CSV
        const csv = `Category,Value\n${label},Mock Data\nPeriod,Monthly\n`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${label.replace(/\s+/g, '_').toLowerCase()}_report.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }}
    >
      <Download className="h-3.5 w-3.5" />
      Download Monthly Stats
    </Button>
  );
}

function downloadFullReport() {
  const rows = [
    ['Category', 'Metric', 'Value'],
    ['Response Type', 'Scene Transports', '5'],
    ['Response Type', 'Modified-Scene Transports', '4'],
    ['Response Type', 'Interfacility Transports', '52'],
    ['Response Type', 'Life or Limb Transports', '11'],
    ['Vehicle', 'Fixed-Wing Transports', '32'],
    ['Vehicle', 'Rotor-Wing Transports', '9'],
    ['Vehicle', 'Land Ambulance Transports', '23'],
    ['Daily Stats', 'Longest Patient Transport', '913 KM'],
    ['Daily Stats', 'Avg Transport Distance', '287 KM'],
    ['Daily Stats', 'Total Flight Hours', '142 hrs'],
    ['Daily Stats', 'Patients Transported', '64'],
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ornge_analytics_report.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDetailedStats() {
  return (
    <div className="space-y-6">
      {/* Summary banner */}
      <Card className="bg-secondary text-secondary-foreground border-none">
        <CardContent className="flex items-center justify-between py-5 px-6">
          <div>
            <p className="text-sm opacity-80">Total Daily Transports</p>
            <p className="text-4xl font-bold font-display">64</p>
          </div>
          <Button
            variant="outline"
            className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10 gap-2"
            onClick={downloadFullReport}
          >
            <Download className="h-4 w-4" />
            Download Full Report
          </Button>
        </CardContent>
      </Card>

      {/* By Response Type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Transports by Response Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile icon={AlertTriangle} value="5" label="Scene Transports" iconColor="text-destructive" />
            <StatTile icon={MapPin} value="4" label="Modified-Scene Transports" iconColor="text-warning" />
            <StatTile icon={Building2} value="52" label="Interfacility Transports" iconColor="text-primary" />
            <StatTile icon={Heart} value="11" label="Life or Limb Transports" iconColor="text-destructive" />
          </div>
          <div className="flex flex-wrap gap-4">
            <DownloadLink label="Scene Transports" />
            <DownloadLink label="Modified-Scene Transports" />
            <DownloadLink label="Interfacility Transports" />
            <DownloadLink label="Life or Limb Transports" />
          </div>
        </CardContent>
      </Card>

      {/* By Vehicle */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Transports by Vehicle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <StatTile icon={Plane} value="32" label="Fixed-Wing Transports" iconColor="text-primary" />
            <StatTile icon={BarChart3} value="9" label="Rotor-Wing Transports" iconColor="text-primary" />
            <StatTile icon={Truck} value="23" label="Land Ambulance Transports" iconColor="text-primary" />
          </div>
          <div className="flex flex-wrap gap-4">
            <DownloadLink label="Fixed-Wing Transports" />
            <DownloadLink label="Rotor-Wing Transports" />
            <DownloadLink label="Land Ambulance Transports" />
          </div>
        </CardContent>
      </Card>

      {/* Other Daily Statistics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-display">Other Daily Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile icon={Route} value="913 KM" label="Longest Patient Transport" />
            <StatTile icon={MapPin} value="287 KM" label="Avg Transport Distance" />
            <StatTile icon={Clock} value="142 hrs" label="Total Flight Hours" />
            <StatTile icon={Users} value="64" label="Patients Transported" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
