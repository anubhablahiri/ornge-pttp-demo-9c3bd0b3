import { AlertTriangle } from 'lucide-react';

export default function DemoDisclaimer() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-white px-4 py-3 shadow-sm">
        <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
        <p className="text-sm text-muted-foreground">
          <span className="font-bold">Note:</span> This application is a prototype for demonstration purposes only and does not represent the final product.
        </p>
      </div>
    </div>
  );
}