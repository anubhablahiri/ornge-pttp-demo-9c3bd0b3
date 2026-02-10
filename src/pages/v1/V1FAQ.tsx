import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const faqs = [
  {
    q: "Why don't I see continuous live updates?",
    a: 'Updates are provided as soon as information becomes available, but timing can change during transport due to care needs, connectivity limits, or operational factors.',
  },
  {
    q: 'Why does the ETA change?',
    a: 'ETAs are best-effort estimates. They may adjust based on weather, patient care requirements, routing, and airport or hospital operations.',
  },
  {
    q: 'Why was there a long gap between updates?',
    a: 'Crews may be in areas with limited connectivity, focused on patient care, or in active flight operations where updates cannot safely be issued.',
  },
  {
    q: "Why doesn't this page show patient medical details?",
    a: 'To protect privacy and comply with health information laws, this page never displays personal health information (PHI). It only shows transport status.',
  },
  {
    q: 'Who can I contact for more information?',
    a: 'Please contact the sending or receiving hospital for clinical updates. For transport-specific questions, contact Ornge at 1-800-461-1911.',
  },
];

export default function V1FAQ() {
  const navigate = useNavigate();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[hsl(220,20%,8%)] text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold">
            Family Portal<span className="text-[hsl(22,90%,54%)]">.</span>
          </h1>
          <button
            onClick={() => navigate('/v1')}
            className="text-sm text-[hsl(212,80%,60%)] hover:text-[hsl(212,80%,70%)] font-medium transition-colors"
          >
            Back
          </button>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
        <p className="text-sm text-[hsl(215,20%,65%)] mb-8">
          This page answers common questions families have during a patient transport. Information may change as care needs evolve.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <button
              key={i}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full text-left bg-[hsl(220,20%,11%)] border border-[hsl(220,14%,20%)] rounded-xl p-5 transition-colors hover:border-[hsl(220,14%,28%)]"
            >
              <h3 className="font-bold text-white mb-1">{faq.q}</h3>
              {(openIdx === i || true) && (
                <p className="text-sm text-[hsl(215,20%,65%)] leading-relaxed">{faq.a}</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
