import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Transport, getCurrentStatusIndex } from '@/data/mockTransports';
import { useApp } from '@/lib/i18n';

interface Props {
  transport: Transport;
  horizontal?: boolean;
}

export default function StatusTimeline({ transport, horizontal = false }: Props) {
  const currentIdx = getCurrentStatusIndex(transport);
  const { t } = useApp();

  if (horizontal) {
    return (
      <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-foreground mb-1">{t('dash.transportProgress')}</h3>
        <p className="text-xs text-muted-foreground mb-5">{t('dash.updatesNote')}</p>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-3.5 left-0 right-0 h-0.5 bg-border mx-6" />
          <div
            className="absolute top-3.5 left-0 h-0.5 bg-success mx-6 transition-all duration-500"
            style={{
              width: `${Math.max(0, (currentIdx / (transport.statuses.length - 1)) * 100)}%`,
            }}
          />

          {/* Milestones */}
          <div className="relative flex justify-between">
            {transport.statuses.map((status, i) => {
              const isCompleted = !!status.completedAt;
              const isActive = status.isActive;
              const isPending = !isCompleted && !isActive;

              return (
                <motion.div
                  key={status.id}
                  className="flex flex-col items-center flex-1 min-w-0"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                >
                  {/* Circle */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold z-10
                    ${isCompleted ? 'bg-success text-success-foreground' : ''}
                    ${isActive ? 'bg-active text-active-foreground animate-pulse-active' : ''}
                    ${isPending ? 'bg-muted text-muted-foreground border-2 border-border' : ''}
                  `}>
                    {isCompleted ? <Check className="h-3 w-3" /> : (i + 1)}
                  </div>

                  {/* Label */}
                  <p className={`text-[9px] leading-tight text-center mt-2 px-0.5 max-w-[72px] ${
                    isActive ? 'text-active font-semibold' : isCompleted ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {t(`milestone.${i}`)}
                  </p>

                  {/* Active message tooltip */}
                  {isActive && (
                    <motion.p
                      className="text-[8px] text-muted-foreground mt-1 text-center max-w-[80px] leading-tight"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {t(`milestone.msg.${i}`)}
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Vertical layout (mobile/tablet)
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-1">{t('dash.transportProgress')}</h3>
      <p className="text-xs text-muted-foreground mb-5">{t('dash.updatesNote')}</p>

      <div className="relative">
        {transport.statuses.map((status, i) => {
          const isCompleted = !!status.completedAt;
          const isActive = status.isActive;
          const isPending = !isCompleted && !isActive;

          return (
            <motion.div
              key={status.id}
              className="flex gap-3 pb-5 last:pb-0"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
                  ${isCompleted ? 'bg-success text-success-foreground' : ''}
                  ${isActive ? 'bg-active text-active-foreground animate-pulse-active' : ''}
                  ${isPending ? 'bg-muted text-muted-foreground border-2 border-border' : ''}
                `}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : (i + 1)}
                </div>
                {i < transport.statuses.length - 1 && (
                  <div className={`w-0.5 flex-1 min-h-[20px] ${isCompleted ? 'bg-success/40' : 'bg-border'}`} />
                )}
              </div>
              <div className="pt-0.5 pb-1 min-w-0">
                <p className={`text-sm font-medium leading-tight ${
                  isActive ? 'text-active' : isCompleted ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {t(`milestone.${i}`)}
                </p>
                {(isActive || (isCompleted && i === currentIdx)) && (
                  <motion.p
                    className="text-xs text-muted-foreground mt-1 leading-relaxed"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    {t(`milestone.msg.${i}`)}
                  </motion.p>
                )}
                {status.completedAt && (
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                    {new Date(status.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
