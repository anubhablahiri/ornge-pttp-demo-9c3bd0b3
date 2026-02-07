import { Phone, HelpCircle, Heart } from 'lucide-react';

export default function FamilySupport() {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Support & Information</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        We understand this is a stressful time. Our team is focused on providing safe and compassionate transport for your family member.
      </p>

      <div className="space-y-3">
        <a
          href="tel:+18004611911"
          className="flex items-center gap-3 p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Transport Coordination</p>
            <p className="text-xs text-muted-foreground">1-800-461-1911</p>
          </div>
        </a>

        <div className="flex items-center gap-3 p-3 rounded-lg bg-accent">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">What happens during transport?</p>
            <p className="text-xs text-muted-foreground">Your loved one is cared for by a specialized medical team throughout the journey.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
