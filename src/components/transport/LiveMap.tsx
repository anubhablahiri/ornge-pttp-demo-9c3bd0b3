import { Transport, getCurrentStatusIndex, isTransportComplete } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';
import { Plane, Truck, CheckCircle2 } from 'lucide-react';

interface Props {
  transport: Transport;
}

// Simplified 5-phase mapping from 10 milestones
function getPhase(idx: number, isComplete: boolean): number {
  if (isComplete) return 4; // Completed
  if (idx <= 2) return 0; // Preparing
  if (idx <= 4) return 1; // En route to pickup
  if (idx <= 6) return 2; // With patient
  return 3; // En route to dropoff
}

export default function LiveMap({ transport }: Props) {
  const { t } = useApp();
  const currentIdx = getCurrentStatusIndex(transport);
  const complete = isTransportComplete(transport);
  const phase = getPhase(currentIdx, complete);
  const isAir = transport.mode === 'air';

  const phases = [
    { en: 'Preparing', fr: 'Préparation' },
    { en: 'En route to pickup', fr: 'En route (prise en charge)' },
    { en: 'With patient', fr: 'Avec le patient' },
    { en: 'En route to dropoff', fr: 'En route (destination)' },
    { en: 'Completed', fr: 'Terminé' },
  ];

  const statusMessages: Record<string, { en: string; fr: string }> = {
    '0': { en: 'The team is preparing for transport.', fr: 'L\'équipe prépare le transport.' },
    '1': { en: `The team is en route to ${transport.originFacility}. Estimated arrival in about ${transport.etaPickup || '—'}.`, fr: `L'équipe est en route vers ${transport.originFacility}. Arrivée estimée dans environ ${transport.etaPickup || '—'}.` },
    '2': { en: `The team is with your family member at ${transport.originFacility}.`, fr: `L'équipe est avec votre proche à ${transport.originFacility}.` },
    '3': { en: `En route to ${transport.destinationFacility}. Estimated arrival in about ${transport.etaDestination || '—'}.`, fr: `En route vers ${transport.destinationFacility}. Arrivée estimée dans environ ${transport.etaDestination || '—'}.` },
    '4': { en: 'The transport has been completed successfully. Your family member has been transferred to the care team.', fr: 'Le transport a été complété avec succès. Votre proche a été transféré à l\'équipe soignante.' },
  };

  const { lang } = useApp();

  const VehicleIcon = isAir ? Plane : Truck;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{t('dash.liveTracking')}</h3>
        {isAir && transport.altitude && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {t('dash.alt')} {transport.altitude.toLocaleString()} ft
          </span>
        )}
      </div>

      {/* Horizontal milestone tracker */}
      <div className="px-5 py-4">
        <div className="flex items-start justify-between relative">
          {phases.map((p, i) => {
            const isCompleted = i < phase;
            const isActive = i === phase;
            const isPending = i > phase;

            return (
              <div key={i} className="flex flex-col items-center flex-1 relative z-10">
                {/* Label */}
                <p className={`text-[10px] leading-tight text-center mb-2 font-medium min-h-[28px] flex items-end justify-center px-1 ${
                  isActive ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground/50'

                }`}>
                  {p[lang]}
                </p>

                {/* Icon */}
                <div className="relative">
                  {i === 4 ? (
                    <CheckCircle2
                      className={`h-5 w-5 ${
                        isCompleted || isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/30'
                      } ${isActive ? 'animate-pulse' : ''}`}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <VehicleIcon
                      className={`h-5 w-5 ${
                        isCompleted || isActive
                          ? 'text-primary'
                          : 'text-muted-foreground/30'
                      } ${isActive ? 'animate-pulse' : ''}`}
                      strokeWidth={2.5}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {/* Connecting lines between icons */}
          <div className="absolute left-0 right-0 top-[44px] flex items-center px-[10%]">
            {[0, 1, 2, 3].map((i) => {
              const segCompleted = i < phase;
              const segActive = i === phase - 1 || i === phase;
              return (
                <div key={i} className="flex-1 flex items-center">
                  <div className={`h-[2px] w-full ${
                    segCompleted ? 'bg-primary' : segActive ? 'bg-primary/40' : 'bg-border'
                  }`}>
                    {/* Midpoint dot for incomplete segments */}
                    {!segCompleted && (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div className={`w-2 h-2 rounded-full ${
                          segActive ? 'bg-primary/40' : 'bg-border'
                        }`} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-5 border-t border-border" />

      {/* Status message */}
      <div className="px-5 py-4">
        <h4 className="text-sm font-display font-bold text-foreground mb-1">
          {lang === 'en' ? 'Status' : 'Statut'}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {statusMessages[String(phase)]?.[lang]}
        </p>
      </div>

      {/* Flight progress bar for air */}
      {isAir && phase === 3 && (
        <div className="px-5 pb-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>{t('dash.flightProgress')}</span>
          </div>
          <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: '50%',
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(22 90% 64%))',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
