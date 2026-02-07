import { Transport } from '@/data/mockTransports';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Users, Wrench, FileText } from 'lucide-react';

interface Props {
  transport: Transport;
}

export default function TransportDetails({ transport }: Props) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="crew" className="border-b border-border">
          <AccordionTrigger className="px-5 py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Crew Information
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crew Type</span>
                <span className="font-medium text-foreground">{transport.crew.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vehicle ID</span>
                <span className="font-medium text-foreground">{transport.crew.vehicleId}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="equipment" className="border-b border-border">
          <AccordionTrigger className="px-5 py-3 text-sm font-semibold hover:no-underline">
            <span className="flex items-center gap-2">
              <Wrench className="h-4 w-4 text-primary" />
              Equipment Onboard
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-4">
            <div className="flex flex-wrap gap-2">
              {transport.crew.equipment.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 bg-accent text-accent-foreground text-xs rounded-full font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {transport.clinicalNotes && (
          <AccordionItem value="notes">
            <AccordionTrigger className="px-5 py-3 text-sm font-semibold hover:no-underline">
              <span className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Clinical Summary
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {transport.clinicalNotes}
              </p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
